import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Error "mo:base/Error";
import Nat "mo:base/Nat";
import Email "Email";
import Ledger "canister:ckbtc_ledger";

actor class Main() = this {
  type Result<T> = Result.Result<T, Text>;

  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };

  type Mail = {
    subject : Text;
    body : Text;
    link : Text;
  };

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

    return #ok(mail);
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
