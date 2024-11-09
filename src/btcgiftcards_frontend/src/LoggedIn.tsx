import { useState } from "react";
import { useAuth } from "./use-auth-client";
import { encodeIcrcAccount } from "@dfinity/ledger-icrc";
import { ckbtc_ledger } from "../../declarations/ckbtc_ledger";
import { Account } from "../../declarations/btcgiftcards_backend/btcgiftcards_backend.did";
import { Principal } from "@dfinity/principal";

function LoggedIn() {
  const [result, setResult] = useState("");
  const [giftcards, setGiftcards] = useState<any>(null);
  const [balance, setBalance] = useState(0n);

  const { backendActor, logout, minterActor } = useAuth();

  const listGiftcards = async () => {
    const res = await backendActor!.listGiftcards();
    console.log(res);
    setGiftcards(res);
    const btcMintPromise = minterActor!.get_btc_address({
      owner: [res.account.owner],
      subaccount: res.account.subaccount,
    });
    const b = await ckbtc_ledger.icrc1_balance_of({
      owner: res.account.owner,
      subaccount: res.account.subaccount,
    });
    console.log("balance", b);
    const btcMint = await btcMintPromise;
    console.log("btc mint", btcMint);

    setBalance(b);
  };

  const encode = (account: Account) => {
    return encodeIcrcAccount({
      owner: account.owner,
      subaccount: account.subaccount[0],
    });
  };

  const handleClick = async () => {
    const email = "icidentify@gmail.com";
    const res = await backendActor!.verifyEmail(email);
    console.log(res);
    setResult(JSON.stringify(res));
    if ("ok" in res) {
      await listGiftcards();
    }
  };

  function replacer(key: any, value: any) {
    if (typeof value === "bigint") {
      return `${value}n`; // Append 'n' to indicate a BigInt
    }
    return value;
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const amount = 10000n;
    const name = event.target.elements.name.value;
    const message = event.target.elements.message.value;
    backendActor!
      .createGiftCard(email, amount, name, message)
      .then((greeting) => {
        console.log(greeting);
        if ("ok" in greeting) setResult(JSON.stringify(greeting.ok, replacer));
        else setResult("" + greeting.err);
      })
      .catch((err) => {
        console.log(err);
        setResult("" + err);
      });
    return false;
  }

  return (
    <div className="container">
      <button id="logout" onClick={logout}>
        log out
      </button>
      <button id="list" onClick={listGiftcards}>
        list
      </button>
      <button id="list" onClick={handleClick}>
        verify
      </button>
      <form action="#" onSubmit={handleSubmit}>
        <label htmlFor="name">Enter your name: &nbsp;</label>
        <input id="name" alt="Name" type="text" />
        <label htmlFor="email">Recipient Email: &nbsp;</label>
        <input id="email" alt="Name" type="text" />
        <label htmlFor="message">Enter a message: &nbsp;</label>
        <textarea id="message" rows={5} />
        <button type="submit">Create Giftcard!</button>
      </form>
      <section id="giftcard">{result}</section>
      <section id="giftcards">
        {giftcards ? encode(giftcards.account) : ""}
        <br />
        <br />
        {JSON.stringify(giftcards?.created, replacer)}
        <br />
        {JSON.stringify(giftcards?.received, replacer)}
        <br />
        {giftcards?.email[0]}
        <br />
        {giftcards?.caller?.toString()}
        <br />
        <br />
        Balance: {balance.toString()} ckSat
      </section>
    </div>
  );
}

export default LoggedIn;
