import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Error "mo:base/Error";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Nat32 "mo:base/Nat32";
import Iter "mo:base/Iter";
import Email "Email";
import Ledger "canister:ckbtc_ledger";
import Map "mo:map/Map";
import Set "mo:map/Set";
import { phash; thash } "mo:map/Map";
import Vec "mo:vector";
import ICLogin "canister:iclogin";
import Sha256 "mo:sha2/Sha256";
import TwoWayMap "TwoWayMap";

actor class Main() = this {
  type Result<T> = Result.Result<T, Text>;
  type Map<K, V> = Map.Map<K, V>;
  type TwoWayMap<K, V> = TwoWayMap.TwoWayMap<K, V>;
  type Set<T> = Set.Set<T>;
  type Vec<V> = Vec.Vector<V>;
  type Time = Time.Time;
  type Account = { owner : Principal; subaccount : ?Blob };
  let self = Principal.fromActor(this);

  let MIN_CARD_FEE = 10;
  //  let CARD_FEE = 180;
  let MIN_AMOUNT = 100;

  type Gift = {
    id : Text;
    creator : Principal;
    to : Text;
    sender : Text;
    message : Text;
    amount : Nat;
    created : Time;
    design : Text;
  };

  stable var created : Map<Principal, Vec<Gift>> = Map.new();
  stable var received : Map<Text, Vec<Gift>> = Map.new();
  // Lookup table from Principal to verified email address
  stable var verified : Map<Principal, Text> = Map.new();
  // Lookup table from gift ID to Gift
  stable var lookup : Map<Text, Gift> = Map.new();
  // List of emails that signed in and can't be refunded with first time of email verification
  stable var locked : Map<Text, Time> = Map.new();
  // List of gift IDs that have been revoked with time of revocation and completion status
  stable var revoked : Map<Text, (Time, Bool, Gift)> = Map.new();
  // List of gift IDs that should be send with current status
  stable var emailQueue : Map<Text, Text> = Map.new();
  // Lookup table from "email login principals" to "II principals"
  stable var securedPrincipals : TwoWayMap<Principal, Principal> = TwoWayMap.new();
  // Lookup table from "email login principals" to "II principals", awaiting confirmation from II principal
  var securedPrincipalsPending : TwoWayMap<Principal, Principal> = TwoWayMap.new();

  public shared ({ caller }) func createGiftCard(email : Text, amount : Nat, fee : Nat, sender : Text, message : Text, design : Text) : async Result<Gift> {
    // check if accout is seccured with II
    if (TwoWayMap.has(securedPrincipals, phash, caller)) return #err("Account is secured. Use II login to create gift cards or withdraw");
    // get original account owner
    let subaccountOwner = switch (TwoWayMap.getReverse(securedPrincipals, phash, caller)) {
      case (?original) { original };
      case (null) { caller };
    };

    // validate email
    if (not Email.isEmail(email)) return #err("Invalid or unsupported email address");
    let #ok(normalized) = Email.normalize(email) else return #err("Failed to normalize email address");

    if (amount < MIN_AMOUNT) return #err("Amount too low");
    if (fee < MIN_CARD_FEE) return #err("Fee too low");

    // transfer funds to subaccount for email
    let fromAccount = getSubaccountPrincipal(subaccountOwner);

    let toAccount = getSubaccountEmail(email);

    let to = { owner = self; subaccount = ?toAccount };
    var blockIndex = 0;
    try {
      let balance = await Ledger.icrc1_balance_of({
        owner = self;
        subaccount = ?fromAccount;
      });
      if (balance < (amount + 10)) return #err("Insufficient funds (" # Nat.toText(balance) # " < " # Nat.toText(amount + 10) # ")");
      let result = await transfer(fromAccount, to, amount);

      blockIndex := switch (result) {
        case (#err err) return #err(err);
        case (#ok blockIndex) blockIndex;
      };
    } catch (error) {
      return #err("Transfer call failed: " # Error.message(error));
    };

    // At this point the ckBTC token is inside the subaccoutn for this email address

    // generate gift card
    let id = giftHash({
      id = "";
      creator = subaccountOwner;
      to = normalized;
      amount;
      sender;
      message;
      created = Time.now();
      design;
    });
    let gift : Gift = {
      id;
      creator = subaccountOwner;
      to = normalized;
      amount;
      sender;
      message;
      created = Time.now();
      design;
    };

    ignore Map.update(
      created,
      phash,
      subaccountOwner,
      func(_ : Principal, x : ?Vec<Gift>) : ?Vec<Gift> {
        switch (x) {
          case (null) ?Vec.init(1, gift);
          case (?mails) {
            Vec.add(mails, gift);
            null;
          };
        };
      },
    );
    ignore Map.update(
      received,
      thash,
      normalized,
      func(_ : Text, x : ?Vec<Gift>) : ?Vec<Gift> {
        switch (x) {
          case (null) ?Vec.init(1, gift);
          case (?mails) {
            Vec.add(mails, gift);
            null;
          };
        };
      },
    );
    Map.set(lookup, thash, gift.id, gift);

    return #ok(gift);
  };

  type SendStatus = { id : Text; status : Text };
  type GiftInfo = {
    created : [Gift];
    refundable : [Text];
    sendStatus : [SendStatus];
    received : [Gift];
    email : ?Text;
    account : Account;
    accountEmail : ?Account;
    caller : Principal;
    subaccountOwner : Principal;
  };

  public shared query ({ caller }) func showGiftcard(id : Text) : async ?{
    gift : Gift;
    sendStatus : SendStatus;
  } {
    let subaccountOwner = switch (TwoWayMap.getReverse(securedPrincipals, phash, caller)) {
      case (?original) { original };
      case (null) { caller };
    };
    switch (Map.get(lookup, thash, id)) {
      case (?gift) {
        return ?{
          gift;
          sendStatus = if (subaccountOwner == gift.creator) {
            getSendStatus(gift);
          } else {
            { id = gift.id; status = "hidden" };
          };
        };
      };
      case (null) return null;
    };
  };

  public shared query ({ caller }) func listGiftcards() : async GiftInfo {
    let subaccountOwner = getSubaccountOwner(caller);

    let send = Option.get<Vec<Gift>>(Map.get(created, phash, subaccountOwner), Vec.new());
    let email = Map.get(verified, phash, subaccountOwner);
    let own : Vec<Gift> = switch (email) {
      case (null) Vec.new<Gift>();
      case (?gmail) Option.get<Vec<Gift>>(Map.get(received, thash, gmail), Vec.new());
    };
    let account = {
      owner = self;
      subaccount = ?getSubaccountPrincipal(subaccountOwner);
    };
    let accountEmail = Option.map<Text, Account>(
      email,
      func(gmail) = { owner = self; subaccount = ?getSubaccountEmail(gmail) },
    );

    let sendArr = Vec.toArray<Gift>(send);
    let refundable = Array.map(Array.filter(sendArr, isRefundable), func(g : Gift) : Text = g.id);
    let sendStatus = Array.map(sendArr, getSendStatus);

    return {
      created = sendArr;
      refundable;
      sendStatus;
      received = Vec.toArray<Gift>(own);
      email;
      account;
      accountEmail;
      caller;
      subaccountOwner;
    };
  };

  private func getSendStatus(gift : Gift) : { id : Text; status : Text } {
    switch (Map.get(revoked, thash, gift.id)) {
      case (?(_, true, _)) return { id = gift.id; status = "cardRevoked" };
      case (?(_, false, _)) return { id = gift.id; status = "cardRevoking" };
      case (null) {};
    };
    return {
      id = gift.id;
      status = Option.get(Map.get(emailQueue, thash, gift.id), "init");
    };
  };

  private func isRefundable(gift : Gift) : Bool {
    switch (Map.get(locked, thash, gift.to)) {
      case (?_time) return false;
      case (null) {};
    };
    switch (Map.get(revoked, thash, gift.id)) {
      case (?(_, true, _)) return false;
      case (?(_, false, _)) return false;
      case (null) {};
    };
    return true;
  };

  public shared ({ caller }) func getEmail() : async Result<Text> {
    let subaccountOwner = getSubaccountOwner(caller);
    switch (Map.get(verified, phash, subaccountOwner)) {
      case (?email) return #ok(email);
      case (null) {};
    };
    try {
      let res = await ICLogin.getEmail(subaccountOwner);
      switch (res) {
        case (?email) {
          Map.set(verified, phash, subaccountOwner, email);
          Map.set(locked, thash, email, Time.now());
          return #ok(email);
        };
        case (null) {
          return #err("No email address assigned to this identity");
        };
      };
    } catch (err) {
      return #err("Failed to get email address for " # Principal.toText(subaccountOwner) # ": " # Error.message(err));
    };
  };

  public shared ({ caller }) func verifyEmail(email : Text) : async Result<Text> {
    let subaccountOwner = getSubaccountOwner(caller);
    if (not Email.isEmail(email)) return #err("Invalid or unsupported email address");
    let #ok(normalized) = Email.normalize(email) else return #err("Failed to normalize email address");
    switch (Map.get(verified, phash, subaccountOwner)) {
      case (?email) {
        if (email == normalized) {
          return #ok(email);
        } else {
          return #err("Account already assigned to " # email);
        };
      };
      case (null) {};
    };
    try {
      let res = await ICLogin.checkEmail(subaccountOwner, email);
      if (res) {
        Map.set(verified, phash, subaccountOwner, normalized);
        Map.set(locked, thash, normalized, Time.now());
        return #ok(email);
      };
      return #err("Email address does not match this identity.");
    } catch (err) {
      return #err("Failed to verify email address " # email # " " # Error.message(err));
    };
  };

  public shared ({ caller }) func refund(id : Text, expectedAmount : Nat) : async Result<Nat> {
    let subaccountOwner = getSubaccountOwner(caller);
    let ?gift = Map.get(lookup, thash, id) else return #err("Gift card not found");
    if (gift.creator != subaccountOwner) return #err("Not created by you");

    switch (Map.get(locked, thash, gift.to)) {
      case (?_time) return #err("Recipient account is protected");
      case (null) {};
    };
    switch (Map.get(revoked, thash, id)) {
      case (?(_, true, _)) return #err("Gift card already refunded");
      case (?(_, false, _)) return #err("Refund already requested");
      case (null) {};
    };

    assert (gift.amount > 10);
    let refundAmount = gift.amount - 10 : Nat;
    if (expectedAmount != refundAmount) return #err("Refund amount does not match");

    Map.set(revoked, thash, gift.id, (Time.now(), false, gift));

    // transfer funds for email back to subaccount
    let fromAccount = getSubaccountEmail(gift.to);
    let toAccount = getSubaccountPrincipal(subaccountOwner);
    let to = { owner = self; subaccount = ?toAccount };
    let result = await transfer(fromAccount, to, refundAmount);

    var blockIndex = 0;
    try {
      blockIndex := switch (result) {
        case (#err err) return #err(err);
        case (#ok blockIndex) blockIndex;
      };
    } catch (error) {
      return #err("Transfer call failed: " # Error.message(error));
    };

    Map.set(revoked, thash, gift.id, (Time.now(), true, gift));
    #ok(blockIndex);
  };

  public shared ({ caller }) func withdraw(to : Account, amount : Nat, main : Bool) : async Result<Nat> {
    // check if accout is seccured with II
    if (TwoWayMap.has(securedPrincipals, phash, caller)) return #err("Account is secured. Use II login to create gift cards or withdraw");
    // get original account owner
    let subaccountOwner = getSubaccountOwner(caller);

    // transfer funds to subaccount for email
    let fromAccount = if (main) {
      getSubaccountPrincipal(subaccountOwner);
    } else {
      let ?email = Map.get(verified, phash, subaccountOwner) else return #err("Email not verified.");
      getSubaccountEmail(email);
    };

    return await transfer(fromAccount, to, amount);
  };

  public shared ({ caller }) func secureAccount(emailAccount : Principal, iiAccount : Principal) : async Result<Text> {
    if (Principal.isAnonymous(caller)) return #err("Caller must not be anonymous");
    if (Principal.isAnonymous(emailAccount)) return #err("Email identity must not be anonymous");
    if (Principal.isAnonymous(iiAccount)) return #err("II identity must not be anonymous");
    if (caller != emailAccount and caller != iiAccount) return #err("Caller does not match any of the provided principals");

    if (not Map.has(verified, phash, emailAccount)) return #err("Email identity not verified");
    if (Map.has(verified, phash, iiAccount)) return #err("II identity must not have verified email");

    if (TwoWayMap.has(securedPrincipals, phash, emailAccount)) return #err("Email identity already secured");
    if (TwoWayMap.has(securedPrincipals, phash, iiAccount)) return #err("Invalid II identity");
    if (TwoWayMap.hasReverse(securedPrincipals, phash, emailAccount)) return #err("Invalid email identity");
    if (TwoWayMap.hasReverse(securedPrincipals, phash, iiAccount)) return #err("II Identity already used to secure another account");

    // First request must be from emailAccount
    if (caller == emailAccount) {
      switch (TwoWayMap.get(securedPrincipalsPending, phash, emailAccount)) {
        case (?storedII) {
          if (storedII != iiAccount) return #err("Already prepared with different II identity");
          return #ok("Already prepared");
        };
        case (null) {
          TwoWayMap.set(securedPrincipalsPending, phash, phash, emailAccount, iiAccount);
          return #ok("Prepared");
        };
      };

    };
    // Second request from iiAccount to complete setup
    if (caller == iiAccount) {
      switch (TwoWayMap.get(securedPrincipalsPending, phash, emailAccount)) {
        case (?storedII) {
          if (storedII != iiAccount) return #err("II principal does not match");
          TwoWayMap.set(securedPrincipals, phash, phash, emailAccount, iiAccount);
          return #ok("Secured");
        };
        case (null) {
          return #err("Not prepared");
        };
      };
    };
    // This should be handled already
    Debug.trap("Unreachable: Caller does not match any of the provided principals.");
  };

  public shared query ({ caller }) func stats() : async Text {
    if (not Principal.isController(caller)) Debug.trap("Permission denied");

    let gifts = Text.join("\n", Iter.map<Gift, Text>(Map.vals(lookup), giftToText));

    "Cards created: " # Nat.toText(Map.size(lookup)) # "\n" #
    "Emails verified: " # Nat.toText(Map.size(verified)) # "\n" #
    gifts;
  };

  public shared query ({ caller }) func getEmailQueue(status : Text) : async Result<[{ gift : Gift; status : Text }]> {
    if (not Principal.isController(caller)) return #err("Permission denied");

    let out : Vec<{ gift : Gift; status : Text }> = Vec.new();
    for ((id, stat) in Map.entries(emailQueue)) {
      if (stat == status or status == "") {
        switch (Map.get(lookup, thash, id)) {
          case (?gift) Vec.add(out, { gift; status });
          case (null) {
            return #err("emailQueue contains invalid card ID " # id);
          };
        };
      };
    };
    return #ok(Vec.toArray(out));
  };

  public shared ({ caller }) func addToEmailQueue(id : Text, status : Text) : async Result<Text> {
    let isSendRequest = status == "sendRequest";
    let isCancelRequest = status == "sendCancel";

    if ((not isSendRequest) and (not isCancelRequest) and (not Principal.isController(caller))) {
      return #err("Permission denied");
    };

    let subaccountOwner = getSubaccountOwner(caller);

    switch (Map.get(lookup, thash, id)) {
      case (?gift) {
        if (gift.creator != subaccountOwner and (not Principal.isController(caller))) {
          return #err("You did not create this gift card");
        };
      };
      case (null) { return #err("Invalid gift ID") };
    };

    switch (Map.get(emailQueue, thash, id)) {
      case (?"sendRequest") {
        if (isSendRequest) {
          return #ok("Already in queue");
        } else if (isCancelRequest) {
          // allowed to cancel
        } else {
          return #err("Gift Card already added to queue");
        };
      };
      case (?"sendCancel") {
        if (isCancelRequest) {
          return #ok("Already canceled");
        } else if (isSendRequest) {
          // allowed to restart
        } else {
          return #err("Gift Card already added to queue");
        };
      };
      case (?status) {
        return #err("Gift card already added to queue");
      };
      case (null) {
        // no previous request
      };
    };

    Map.set(emailQueue, thash, id, status);

    if (isSendRequest) {
      return #ok("Added to queue");
    } else {
      return #ok("Status updated to " # status);
    };
  };

  private func transfer(from : Blob, to : Account, amount : Nat) : async Result<Nat> {
    let transferArgs : Ledger.TransferArg = {
      memo = null;
      amount;
      from_subaccount = ?from;
      fee = null;
      to;
      created_at_time = null;
    };
    try {
      let result = await Ledger.icrc1_transfer(transferArgs);
      switch (result) {
        case (#Err err) return #err("Transfer failed: " # debug_show (err));
        case (#Ok blockIndex) return #ok(blockIndex);
      };
    } catch (error) {
      return #err("Transfer call failed: " # Error.message(error));
    };
  };

  private func getSubaccountOwner(caller : Principal) : Principal {
    switch (TwoWayMap.getReverse(securedPrincipals, phash, caller)) {
      case (?original) { return original };
      case (null) { return caller };
    };
  };

  private func getSubaccountEmail(email : Text) : Blob {
    let hash = Blob.toArray(Sha256.fromBlob(#sha224, Text.encodeUtf8(email)));
    assert (hash.size() < 32);

    Blob.fromArray(Array.tabulate(32, func(i : Nat) : Nat8 = if (i < hash.size()) hash[i] else 0xee));
  };

  private func getSubaccountPrincipal(principal : Principal) : Blob {
    if (Principal.isAnonymous(principal)) Debug.trap("Not logged in");

    let p = Blob.toArray(Principal.toBlob(principal));
    assert (p.size() < 32);

    Blob.fromArray(Array.tabulate(32, func(i : Nat) : Nat8 = if (i < p.size()) p[i] else 0xbb));
  };

  private func giftToText(gift : Gift) : Text {
    formatCkBtc(gift.amount) # " to " # gift.to;
  };

  private func formatCkBtc(amount : Nat) : Text {
    Nat.toText(amount) # " ckSat";
  };

  private func giftHash(gift : Gift) : Text {
    let time = Int.toText(gift.created);
    let hash = Nat32.toText(Text.hash(gift.to # gift.message));
    hash # time;
  };

};
