import { useState } from "react";
import { LedgerActor, useAuth } from "./use-auth-client";
import { encodeIcrcAccount } from "@dfinity/ledger-icrc";
import { ckbtc_ledger } from "../../declarations/ckbtc_ledger";
import {
  Account,
  Gift,
  GiftInfo,
} from "../../declarations/backend/backend.did";
import { useQuery } from "@tanstack/react-query";

function LoggedIn() {
  const [result, setResult] = useState("");
  const [giftcards, setGiftcards] = useState<any>(null);
  const [balance, setBalance] = useState(0n);

  const { backendActor, logout, minterActor } = useAuth();

  const giftcardsQuery = useQuery({
    queryKey: ["giftcards", backendActor],
    queryFn: () => backendActor?.listGiftcards(),
  });

  const listGiftcards = async () => {
    const res = await backendActor!.listGiftcards();
    console.log(res);
    setGiftcards(res);
    //const btcMintPromise = minterActor!.get_btc_address({
    //  owner: [res.account.owner],
    //  subaccount: res.account.subaccount,
    //});

    //const btcMint = await btcMintPromise;
    //console.log("btc mint", btcMint);
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
        Status {JSON.stringify(giftcardsQuery.error ?? "ok", replacer)}
        <br />
        <br />
        <br />
        {giftcardsQuery.data && (
          <UserInfo info={giftcardsQuery.data} ledger={ckbtc_ledger} />
        )}
        <br />
        {giftcardsQuery.data?.created.map((gift) => GiftCard(gift)) ??
          "No gift cards created"}
        <br />
        {giftcardsQuery.data?.received.map((gift) => GiftCard(gift)) ??
          "No gift cards received"}
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

function formatDateFromNano(time: bigint): string {
  const date = new Date(Number(time / 1_000_000n));
  return date.toISOString().substring(0, 10);
}

function UserInfo(props: { info: GiftInfo; ledger: LedgerActor }) {
  const balanceQuery = useQuery({
    queryKey: ["userinfo", props.info?.account.owner.toString()],
    queryFn: () => {
      return props.ledger.icrc1_balance_of({
        owner: props.info.account.owner,
        subaccount: props.info.account.subaccount,
      });
    },
  });

  const encode = (account: Account) => {
    return encodeIcrcAccount({
      owner: account.owner,
      subaccount: account.subaccount[0],
    });
  };

  return (
    <div>
      {balanceQuery.data?.toString()} ckSat
      <br />
      {props.info && encode(props.info.account)}
    </div>
  );
}

function GiftCard(gift: Gift) {
  return (
    <div className="card">
      <div>To: {gift.to}</div>
      <div>Created on {formatDateFromNano(gift.created)}</div>
      <div>{gift.subject}</div>
      <a href={gift.link} target="_blank" className="card-body">
        <div>{gift.body}</div>
      </a>
    </div>
  );
}

export default LoggedIn;
