import { useState } from "react";
import { LedgerActor, useAuth } from "./use-auth-client";
import { encodeIcrcAccount } from "@dfinity/ledger-icrc";
import { ckbtc_ledger } from "../../declarations/ckbtc_ledger";
import {
  Account,
  Gift,
  GiftInfo,
} from "../../declarations/backend/backend.did";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CopyButton from "./CopyButton";

function LoggedIn() {
  const [result, setResult] = useState("");
  const queryClient = useQueryClient();

  const { backendActor, logout, minterActor, isAuthenticated, identity } =
    useAuth();

  const { isLoading, isError, data, refetch, error } = useQuery({
    queryKey: ["giftcards", backendActor, isAuthenticated],
    queryFn: () => {
      if (identity && !identity.getPrincipal().isAnonymous()) {
        return backendActor?.listGiftcards();
      }
      return null;
    },
  });

  const formVerifyEmail = async (event: any) => {
    event.preventDefault();
    const email = "icidentify@gmail.com"; //TODO! set email address
    const res = await backendActor!.verifyEmail(email);
    console.log(res);
    if ("ok" in res) {
      setResult("Verified " + res.ok);
      queryClient.invalidateQueries();
    } else {
      setResult("Error: " + res.err);
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
      <form action="#" onSubmit={handleSubmit} className="box">
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
        <div className="box">
          User info status{" "}
          {isLoading ? "loading..." : isError ? "error " + error : "ok"}
          {data?.email.length === 1 ? (
            "Own email address " + data.email[0]
          ) : (
            <div>
              <form action="#" onSubmit={formVerifyEmail}>
                <label htmlFor="gmail">Enter a message: &nbsp;</label>
                <input id="gmail" type="text" />
                <button type="submit">Verify Gmail Address</button>
              </form>
            </div>
          )}
          {data && <UserInfo info={data} ledger={ckbtc_ledger} />}
        </div>
        <div className="box">
          <h3>Created Gift Cards</h3>
          <GiftcardList gifts={data?.created ?? []} />
        </div>
        <div className="box">
          <h3>Received Gift Cards</h3>
          <GiftcardList gifts={data?.received ?? []} />
        </div>
      </section>
    </div>
  );
}

function formatDateFromNano(time: bigint): string {
  const date = new Date(Number(time / 1_000_000n));
  return date.toISOString().substring(0, 10);
}

function GiftcardList({ gifts }: { gifts: Gift[] }) {
  if (gifts.length === 0) return "No gift cards";

  return (
    <div>
      {gifts.map((gift) => (
        <GiftCard gift={gift} />
      ))}
    </div>
  );
}

function UserInfo(props: { info: GiftInfo; ledger: LedgerActor }) {
  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["userinfo", props.info.account.owner.toString()],
    queryFn: () => {
      return props.ledger.icrc1_balance_of({
        owner: props.info.account.owner,
        subaccount: props.info.account.subaccount,
      });
    },
  });

  const giftCardBalance = useQuery({
    queryKey: ["userinfo", props.info?.accountEmail?.[0]?.owner.toString()],
    queryFn: () => {
      if (!props.info.accountEmail?.[0]) return null;
      return props.ledger.icrc1_balance_of({
        owner: props.info.accountEmail[0].owner,
        subaccount: props.info.accountEmail[0].subaccount,
      });
    },
  });

  const encode = (account: Account) => {
    return encodeIcrcAccount({
      owner: account.owner,
      subaccount: account.subaccount[0],
    });
  };

  const email = props.info.email[0];

  return (
    <div>
      <br />
      ckBTC deposit account:{" "}
      <CopyButton
        label="Copy Deposit Account"
        textToCopy={encode(props.info.account)}
      />
      <div className="info-address">{encode(props.info.account)}</div>
      <br />
      Account balance:{" "}
      {!isError ? data?.toString() + " ckSat" : "Error " + error}
      <br />
      email: {email ?? "Not verified"}
      <br />
      Gift card balance:{" "}
      {email
        ? !giftCardBalance.isError
          ? giftCardBalance.data?.toString() + " ckSat"
          : "Error " + error
        : "-"}
      <br />
    </div>
  );
}

function GiftCard({ gift }: { gift: Gift }) {
  return (
    <div className="card">
      <div className="card-date">{formatDateFromNano(gift.created)}</div>
      <div>To: {gift.to}</div>
      <br />
      <div>You received a gift from {gift.sender}</div>
      <br />
      <br />
      <a href={"/redeem#" + gift.id} target="_blank" className="card-body">
        <div>{gift.message}</div>
      </a>
    </div>
  );
}

export default LoggedIn;
