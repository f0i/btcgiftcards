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

  let CARD_FEE = 180;

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
  stable var verified : Map<Principal, Text> = Map.new();
  stable var lookup : Map<Text, Gift> = Map.new();
  stable var locked : Map<Text, Time> = Map.new();
  stable var revoked : Map<Text, (Time, Bool, Gift)> = Map.new();

  public shared ({ caller }) func createGiftCard(email : Text, amount : Nat, sender : Text, message : Text, design : Text) : async Result<Gift> {
    // validate email
    if (not Email.isGmail(email)) return #err("Invalid or unsupported email address");
    let #ok(normalized) = Email.normalize(email) else return #err("Failed to normalize email address");

    // transfer funds to subaccount for email
    let fromAccount = getSubaccountPrincipal(caller);

    let feeAccount = { owner = self; subaccount = ?getSubaccountFor(#fees) };

    let toAccount = getSubaccountEmail(email);

    let to = { owner = self; subaccount = ?toAccount };
    var blockIndex = 0;
    try {
      ignore await transfer(fromAccount, feeAccount, CARD_FEE);
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

  type GiftInfo = {
    created : [Gift];
    received : [Gift];
    email : ?Text;
    account : Account;
    accountEmail : ?Account;
    caller : Principal;
  };

  public shared query func showGiftcard(id : Text) : async ?Gift {
    return Map.get(lookup, thash, id);
  };

  public shared query ({ caller }) func listGiftcards() : async GiftInfo {
    let send = Option.get<Vec<Gift>>(Map.get(created, phash, caller), Vec.new());
    let email = Map.get(verified, phash, caller);
    let own : Vec<Gift> = switch (email) {
      case (null) Vec.new<Gift>();
      case (?gmail) Option.get<Vec<Gift>>(Map.get(received, thash, gmail), Vec.new());
    };
    let account = { owner = self; subaccount = ?getSubaccountPrincipal(caller) };
    let accountEmail = Option.map<Text, Account>(
      email,
      func(gmail) = { owner = self; subaccount = ?getSubaccountEmail(gmail) },
    );

    return {
      created = Vec.toArray<Gift>(send);
      received = Vec.toArray<Gift>(own);
      email;
      account;
      accountEmail;
      caller;
    };
  };

  public shared ({ caller }) func verifyEmail(email : Text) : async Result<Text> {
    if (not Email.isGmail(email)) return #err("Invalid or unsupported email address");
    let #ok(normalized) = Email.normalize(email) else return #err("Failed to normalize email address");
    try {
      let res = await ICLogin.checkEmail(caller, email);
      if (res) {
        Map.set(verified, phash, caller, normalized);
        Map.set(locked, thash, normalized, Time.now());
        return #ok(email);
      };
      return #err("Email address could not be verified");
    } catch (err) {
      return #err("Failed to verify email address " # email # " " # Error.message(err));
    };
  };

  public shared ({ caller }) func refund(id : Text, expectedAmount : Nat) : async Result<Nat> {
    let ?gift = Map.get(lookup, thash, id) else return #err("Gift card not found");
    if (gift.creator != caller) return #err("Not created by you");

    switch (Map.get(revoked, thash, id)) {
      case (?(_, true, _)) return #err("Gift card already revoked");
      case (?(_, false, _)) return #err("Refund is pending");
      case (null) {};
    };

    assert (gift.amount > 10);
    let refundAmount = gift.amount - 10 : Nat;
    if (expectedAmount != refundAmount) return #err("Refund amount does not match");

    Map.set(revoked, thash, gift.id, (Time.now(), false, gift));

    // transfer funds for email back to subaccount
    let fromAccount = getSubaccountEmail(gift.to);
    let toAccount = getSubaccountPrincipal(caller);
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

    // transfer funds to subaccount for email
    let fromAccount = if (main) {
      getSubaccountPrincipal(caller);
    } else {
      let ?email = Map.get(verified, phash, caller) else return #err("Email not verified.");
      getSubaccountEmail(email);
    };

    return await transfer(fromAccount, to, amount);
  };

  public shared query ({ caller }) func stats() : async Text {
    if (not Principal.isController(caller)) Debug.trap("Permission denied");

    let gifts = Text.join("\n", Iter.map<Gift, Text>(Map.vals(lookup), giftToText));

    "Cards created: " # Nat.toText(Map.size(lookup)) # "\n" #
    "Emails verified: " # Nat.toText(Map.size(verified)) # "\n" #
    gifts;
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

  private func getSubaccountFor(category : { #fees; #donate }) : Blob {
    switch (category) {
      case (#fees) Blob.fromArray(Array.tabulate(32, func(i : Nat) : Nat8 = if (i == 0) 0xff else 0x00));
      case (#donate) Blob.fromArray(Array.tabulate(32, func(i : Nat) : Nat8 = if (i == 0) 0xdd else 0x00));
    };
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
