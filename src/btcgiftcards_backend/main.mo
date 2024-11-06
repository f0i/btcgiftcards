import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Error "mo:base/Error";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Email "Email";
import Ledger "canister:ckbtc_ledger";
import Map "mo:map/Map";
import Set "mo:map/Set";
import { phash; thash } "mo:map/Map";
import Vec "mo:vector";

actor class Main() = this {
  type Result<T> = Result.Result<T, Text>;
  type Map<K, V> = Map.Map<K, V>;
  type Vec<V> = Vec.Vector<V>;

  type Mail = {
    subject : Text;
    body : Text;
    link : Text;
  };

  stable var created : Map<Principal, Vec<Mail>> = Map.new();
  stable var received : Map<Text, Vec<Mail>> = Map.new();
  stable var verified : Map<Principal, Text> = Map.new();

  public shared ({ caller }) func createGiftCard(email : Text, amount : Nat, sender : Text, message : Text) : async Result<Mail> {
    // validate email
    if (not Email.isGmail(email)) return #err("Invalid or unsupported email address");
    let normalized = Email.normalize(email);
    let self = Principal.fromActor(this);

    // transfer funds to subaccount for email
    let fromAccount = getSubaccountPrincipal(caller);
    let toAccount = getSubaccountEmail(email);
    let transferArgs : Ledger.TransferArg = {
      memo = null;
      amount;
      from_subaccount = ?fromAccount;
      fee = null;
      to = { owner = self; subaccount = ?toAccount };
      created_at_time = null;
    };
    var blockIndex = 0;
    try {
      let result = await Ledger.icrc1_transfer(transferArgs);
      blockIndex := switch (result) {
        case (#Err err) return #err("Transfer failed: " # debug_show (err));
        case (#Ok blockIndex) blockIndex;
      };
    } catch (error) {
      return #err("Transfer call failed: " # Error.message(error));
    };

    // At this point the ckBTC token is inside the subaccoutn for this email address

    // generate gift card
    let link = "https://giftcard.f0i.de/redeem"; // TODO!
    let mail = {
      to = normalized;
      subject = "You've Received a Gift from " # sender;
      body = message # "/n/n"
      # "To redeem your " # formatCkBtc(amount) # ", simply click, the link below:/n/n"
      # link # "/n/n"
      # "Follow the instruction and ideas how to use them./n/n"
      # "Enjoy!";
      link;
    };

    Map.update(
      created,
      phash,
      caller,
      func(x) {
        switch (x) {
          case (null) Vec.init(1, mail);
          case (?mails) Vec.add(mails, mail);
        };
      },
    );
    Map.update(
      received,
      thash,
      normalized,
      func(x) {
        switch (x) {
          case (null) Vec.init(1, mail);
          case (?mails) Vec.add(mails, mail);
        };
      },
    );

    return #ok(mail);
  };

  public shared query ({ caller }) func listGiftcards() : async {
    created : [Mail];
    received : [Mail];
    email : ?Text;
  } {
    let send = Option.withDefault(Map.get(created, phash, caller), Vec.new());
    let email = Map.get(verified, phash, principal);
    let own = switch (email) {
      case (null) Vec.new();
      case (?gmail) Option.get(Map.get(received, thash, gmail), Vec.new());
    };

    return {
      created = Vec.toArray(send);
      received = Vec.toArray(own);
      email;
    };
  };

  public shared ({ caller }) func verifyEmail(email : Text) {

  };

  private func getSubaccountEmail(email : Text) : Blob {
    let p = Blob.toArray(Text.encodeUtf8(email));
    if (p.size() >= 32) Debug.trap("Email address too long");

    Blob.fromArray(Array.tabulate(32, func(i : Nat) : Nat8 = if (i < p.size()) p[i] else 0x00));
  };

  private func getSubaccountPrincipal(principal : Principal) : Blob {
    if (Principal.isAnonymous(principal)) Debug.trap("Must not be anonymous");

    let p = Blob.toArray(Principal.toBlob(principal));
    assert (p.size() < 32);

    Blob.fromArray(Array.tabulate(32, func(i : Nat) : Nat8 = if (i < p.size()) p[i] else 0x01));
  };

  private func formatCkBtc(amount : Nat) : Text {
    Nat.toText(amount) # " ckSat";
  };

};
