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

actor class Main() = this {
  type Result<T> = Result.Result<T, Text>;
  type Map<K, V> = Map.Map<K, V>;
  type Set<T> = Set.Set<T>;
  type Vec<V> = Vec.Vector<V>;
  type Time = Time.Time;
  type Account = { owner : Principal; subaccount : ?Blob };
  let self = Principal.fromActor(this);

  let MIN_CARD_FEE = 10;
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
  // List of gift IDs that are claimed and can't be refunded
  stable var locked : Map<Text, Time> = Map.new();
  // List of gift IDs that have been revoked with time of revocation and completion status
  stable var revoked : Map<Text, (Time, Bool, Gift)> = Map.new();
  // List of gift IDs that should be send with current status
  stable var emailQueue : Map<Text, SendStatus> = Map.new();
  emailQueue := Map.new(); // TODO: remove after next deployment

  let testUser = Principal.fromText("5jz2b-l4l3e-xmvdh-hk6v6-u6u3m-guhcy-zzjdt-3bane-x3diu-7jm7e-vqe");
  Map.set(verified, phash, testUser, "asdf@localhost.local");

  public shared ({ caller }) func createGiftCard(email : Text, amount : Nat, fee : Nat, sender : Text, message : Text, design : Text) : async Result<Gift> {
    let ?senderEmail = Map.get(verified, phash, caller) else return #err("Email address not verified");

    // validate email
    if (not Email.isEmail(email)) return #err("Invalid or unsupported email address");
    let #ok(normalized) = Email.normalize(email) else return #err("Failed to normalize email address");

    if (amount < MIN_AMOUNT) return #err("Amount too low");
    if (fee < MIN_CARD_FEE) return #err("Fee too low");

    // transfer funds to subaccount for email
    let fromAccount = getSubaccountEmail(senderEmail);

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
      creator = caller;
      to = normalized;
      amount;
      sender;
      message;
      created = Time.now();
      design;
    });
    let gift : Gift = {
      id;
      creator = caller;
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
      caller,
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

  type SendStatus = {
    #sendRequested : Time;
    #sendCanceled;
    #send : Time;
    #init;
    #claimed : Time;
    #revoking : Time;
    #revoked : Time;
  };
  public type SendStatusEntry = {
    id : Text;
    status : SendStatus;
  };

  type GiftInfo = {
    created : [Gift];
    refundable : [Text];
    sendStatus : [SendStatusEntry];
    received : [Gift];
    email : Text;
    account : Account;
    caller : Principal;
  };

  public shared query func showGiftcard(id : Text) : async ?{
    gift : Gift;
    sendStatus : SendStatus;
  } {
    switch (Map.get(lookup, thash, id)) {
      case (?gift) {
        return ?{
          gift;
          sendStatus = getSendStatus(gift);
        };
      };
      case (null) return null;
    };
  };

  public shared query ({ caller }) func listGiftcards() : async Result<GiftInfo> {
    let send = Option.get<Vec<Gift>>(Map.get(created, phash, caller), Vec.new());
    let ?email = Map.get(verified, phash, caller) else return #err("Email address not verified");
    let own : Vec<Gift> = Option.get<Vec<Gift>>(Map.get(received, thash, email), Vec.new());
    let account = { owner = self; subaccount = ?getSubaccountEmail(email) };

    let sendArr = Vec.toArray<Gift>(send);
    let refundable = Array.map(Array.filter(sendArr, isRefundable), func(g : Gift) : Text = g.id);
    let sendStatus = Array.map(sendArr, getSendStatusEntry);

    return #ok({
      created = sendArr;
      refundable;
      sendStatus;
      received = Vec.toArray<Gift>(own);
      email;
      account;
      caller;
    });
  };

  private func getSendStatus(gift : Gift) : SendStatus {
    switch (Map.get(revoked, thash, gift.id)) {
      case (?(time, true, _)) return #revoked(time);
      case (?(time, false, _)) return #revoking(time);
      case (null) {};
    };
    return Option.get(Map.get(emailQueue, thash, gift.id), #init);
  };

  private func getSendStatusEntry(gift : Gift) : SendStatusEntry {
    return {
      id = gift.id;
      status = getSendStatus(gift);
    };
  };

  private func isRefundable(gift : Gift) : Bool {
    // to account locked
    switch (Map.get(locked, thash, gift.to)) {
      case (?_time) return false;
      case (null) {};
    };
    // gift ID locked
    switch (Map.get(locked, thash, gift.id)) {
      case (?_time) return false;
      case (null) {};
    };
    // gift ID revoked (already refunded or refund in progress)
    switch (Map.get(revoked, thash, gift.id)) {
      case (?(_, true, _)) return false;
      case (?(_, false, _)) return false;
      case (null) {};
    };
    return true;
  };

  // Map of principals that requested their email address from ICLogin with an error message if it has failed
  // This is mostly to avoid eamils being requested over if principal is from another provider
  var emailRequested : Map<Principal, Text> = Map.new();

  /// Get the email address for a principal. If not requested already, look it up from ICLogin.
  public shared ({ caller }) func getEmail(origin : Text) : async Result<Text> {
    if (Principal.isAnonymous(caller)) return #err("Not signed in");
    switch (Map.get(verified, phash, caller)) {
      case (?email) return #ok(email);
      case (null) {};
    };
    switch (Map.get(emailRequested, phash, caller)) {
      case (?err) return #err(err);
      case (null) {
        Map.set(emailRequested, phash, caller, "Request pening");
      };
    };

    try {
      let res = await ICLogin.getEmail(caller, origin);
      switch (res) {
        case (?email) {
          Map.set(verified, phash, caller, email);
          Map.set(locked, thash, email, Time.now());
          return #ok(email);
        };
        case (null) {
          Map.set(emailRequested, phash, caller, "requested");
          return #err("No email address assigned to this identity");
        };
      };
    } catch (err) {
      let msg = "Failed to get email address for " # Principal.toText(caller) # ": " # Error.message(err);
      Map.set(emailRequested, phash, caller, msg);
      return #err(msg);
    };
  };

  public shared ({ caller }) func refund(id : Text, expectedAmount : Nat) : async Result<Nat> {
    let ?gift = Map.get(lookup, thash, id) else return #err("Gift card not found");
    if (gift.creator != caller) return #err("Not created by you");
    let ?callerEmail = Map.get(verified, phash, caller) else return #err("Email not verified");

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
    let toAccount = getSubaccountEmail(callerEmail);
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

  public shared ({ caller }) func withdraw(to : Account, amount : Nat) : async Result<Nat> {
    // transfer funds to subaccount for email
    let ?email = Map.get(verified, phash, caller) else return #err("Email not verified.");
    let fromAccount = getSubaccountEmail(email);

    return await transfer(fromAccount, to, amount);
  };

  public shared query ({ caller }) func stats() : async Text {
    if (not Principal.isController(caller)) Debug.trap("Permission denied");

    let gifts = Text.join("\n", Iter.map<Gift, Text>(Map.vals(lookup), giftToText));

    "Cards created: " # Nat.toText(Map.size(lookup)) # "\n" #
    "Emails verified: " # Nat.toText(Map.size(verified)) # "\n" #
    gifts;
  };

  public shared query ({ caller }) func getEmailQueue(all : Bool) : async Result<[{ gift : Gift; status : SendStatus }]> {
    if (not Principal.isController(caller)) return #err("Permission denied");

    let out : Vec<{ gift : Gift; status : SendStatus }> = Vec.new();
    for ((id, status) in Map.entries(emailQueue)) {
      let show = all or (
        switch (status) {
          case (#sendRequested(_)) true;
          case (_) false;
        }
      );
      if (show) {
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

  public shared ({ caller }) func claim(id : Text) : async Result<Text> {
    let claimAll = id == "*";
    let now = Time.now();

    let email = Map.get(verified, phash, caller);
    let own : Vec<Gift> = switch (email) {
      case (null) Vec.new<Gift>();
      case (?gmail) Option.get<Vec<Gift>>(Map.get(received, thash, gmail), Vec.new());
    };

    if (claimAll) {
      var count = 0;
      for (gift in Vec.vals(own)) {
        switch (getSendStatus(gift)) {
          // ignore claimed and revoked
          case (#claimed(_time)) {};
          case (#revoking(_time)) {};
          case (#revoked(_time)) {};
          // set status to claimed
          case (_) {
            Map.set(emailQueue, thash, id, #claimed(now));
            Map.set(locked, thash, id, now);
            count += 1;
          };
        };
      };
      #ok(if (count == 1) "1 gift card claimed" else (Nat.toText(count) # " gift cards claimed"));
    } else {
      let ?gift = Map.get(lookup, thash, id) else return #err("Invalid gift ID");

      switch (getSendStatus(gift)) {
        // ignore claimed and revoked
        case (#claimed(_time)) return #err("Already claimed");
        case (#revoking(_time)) return #err("Revoked");
        case (#revoked(_time)) return #err("Revoked");
        // set status to claimed
        case (_) {
          Map.set(emailQueue, thash, id, #claimed(now));
          Map.set(locked, thash, id, now);
          return #ok("gift card claimed");
        };
      };
    };
  };

  public shared ({ caller }) func addToEmailQueue(id : Text, request : Bool) : async Result<Text> {
    switch (Map.get(lookup, thash, id)) {
      case (?gift) {
        if (gift.creator != caller and (not Principal.isController(caller))) {
          return #err("You did not create this gift card");
        };
      };
      case (null) { return #err("Invalid gift ID") };
    };

    switch (Map.get(emailQueue, thash, id)) {
      case (?#sendRequested(_time)) {
        if (request) {
          return #ok("Already in queue");
        } else {
          // allowed to cancel
        };
      };
      case (?#sendCanceled(_time)) {
        if (not request) {
          return #ok("Already canceled");
        } else {
          // allowed to restart
        };
      };
      case (?_) {
        return #err("Gift card already processed");
      };
      case (null) {
        // no previous request
      };
    };

    let status = if (request) #sendRequested(Time.now()) else #sendCanceled;
    Map.set(emailQueue, thash, id, status);

    if (request) {
      return #ok("Added to queue");
    } else {
      return #ok("Removed from queue");
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

  private func getSubaccountEmail(email : Text) : Blob {
    let hash = Blob.toArray(Sha256.fromBlob(#sha224, Text.encodeUtf8(email)));
    assert (hash.size() < 32);

    Blob.fromArray(Array.tabulate(32, func(i : Nat) : Nat8 = if (i < hash.size()) hash[i] else 0xee));
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
