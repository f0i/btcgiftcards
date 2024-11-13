import { useState } from "react";
import {
  BackendActor,
  LedgerActor,
  MinterActor,
  useAuth,
} from "./use-auth-client";
import { decodeIcrcAccount, encodeIcrcAccount } from "@dfinity/ledger-icrc";
import { ckbtc_ledger } from "../../declarations/ckbtc_ledger";
import {
  Account,
  Gift,
  GiftInfo,
} from "../../declarations/backend/backend.did";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CopyButton from "./CopyButton";
import { backend } from "../../declarations/backend";
import { QRCodeSVG } from "qrcode.react";

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
        queryClient.invalidateQueries();
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
        <h3>New Gift Card</h3>
        <label htmlFor="name">Enter your name: &nbsp;</label>
        <input id="name" alt="Name" type="text" />
        <label htmlFor="email">Recipient Email: &nbsp;</label>
        <input id="email" alt="Name" type="email" />
        <label htmlFor="message">Enter a message: &nbsp;</label>
        <textarea id="message" rows={5} />
        <button type="submit">Create Giftcard!</button>
      </form>
      <section id="giftcard">{result}</section>
      <section id="giftcards">
        <div className="box">
          <h3>User Info</h3>
          {isLoading ? "loading..." : isError ? "Error " + error : ""}
          {data?.email.length === 1 ? (
            ""
          ) : (
            <div>
              <form action="#" onSubmit={formVerifyEmail}>
                <label htmlFor="gmail">Your gmail address: &nbsp;</label>
                <input id="gmail" type="text" />
                <button type="submit">Verify Gmail Address</button>
              </form>
            </div>
          )}
          {data && backendActor && minterActor && (
            <UserInfo
              info={data}
              ledger={ckbtc_ledger}
              backend={backendActor}
              minter={minterActor}
            />
          )}
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

function DepositAddressBTC(props: { info: GiftInfo; minter: MinterActor }) {
  const queryClient = useQueryClient();
  const account = props.info.account;
  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["deposit-address-btc", props.info.account.subaccount.toString()],
    queryFn: () => {
      return props.minter.get_btc_address({
        owner: [account.owner],
        subaccount: account.subaccount,
      });
    },
  });

  // TODO: remove dummy address
  //return <BTCQRCode btcAddress="bc1qyawapemf4nsv6lc4z9tcltgfymsl2wklnecqlw" />;
  if (isLoading) return <div>Loading BTC depossit address...</div>;
  // TODO: log error
  if (isError) return <div>Error getting BTC depossit address.</div>;
  if (!data) return <div>No Data received</div>;
  return <BTCQRCode btcAddress={data} />;
}

const BTCQRCode = ({ btcAddress }: { btcAddress: string }) => {
  const btcUri = `bitcoin:${btcAddress}`;

  return (
    <div className="min-height-">
      BTC deposit account:{" "}
      <CopyButton label="Copy BTC Deposit Address" textToCopy={btcAddress} />
      <br />
      <div className="info-address min-height-200">
        <span className="max-w-600">{btcAddress}</span>
        <QRCodeSVG
          width={150}
          className="float-right w-300"
          value={btcUri}
          size={150} // in pixels
          fgColor="#000000"
          bgColor="transparent"
          level="H" // Error correction: L, M, Q, H
          marginSize={1}
        />
      </div>
    </div>
  );
};

function UserInfo(props: {
  info: GiftInfo;
  ledger: LedgerActor;
  backend: BackendActor;
  minter: MinterActor;
}) {
  const queryClient = useQueryClient();

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
    queryKey: [
      "userinfo",
      props.info?.accountEmail?.[0]?.subaccount.toString(),
    ],
    queryFn: () => {
      if (!props.info.accountEmail?.[0]) return null;
      return props.ledger.icrc1_balance_of({
        owner: props.info.accountEmail[0].owner,
        subaccount: props.info.accountEmail[0].subaccount,
      });
    },
  });

  const encode = (account: Account): string => {
    return encodeIcrcAccount({
      owner: account.owner,
      subaccount: account.subaccount?.[0],
    });
  };
  const decode = (account: string): Account => {
    let icrcAccount = decodeIcrcAccount(account);
    return {
      owner: icrcAccount.owner,
      subaccount: icrcAccount.subaccount ? [icrcAccount.subaccount] : [],
    };
  };

  const email = props.info.email[0];

  const formWithdraw = async (event: any) => {
    event.preventDefault();
    const account = event.target.elements.account.value;
    const main = event.target.elements.main.value === "main";
    const amount = BigInt(event.target.elements.amount.value);
    const toAccount = decode(account);
    if (
      !confirm(
        "Withdraw " +
          amount +
          " ckSat from " +
          (main ? "Main account" : "Gift Cards") +
          " to \n" +
          encode(toAccount) +
          "?",
      )
    ) {
      alert("Withdrawl canceled.");
      return;
    }

    const res = await props.backend.withdraw(toAccount, amount, main);
    console.log(res);
    if ("ok" in res) {
      alert("Withdrawal was successful!\nTransaction ID " + res.ok);
      queryClient.invalidateQueries();
    } else {
      alert("Error: " + res.err);
    }
  };

  return (
    <div>
      <br />
      <DepositAddressBTC minter={props.minter} info={props.info} />
      ckBTC deposit account:{" "}
      <CopyButton
        label="Copy ckBTC Deposit Account"
        textToCopy={encode(props.info.account)}
      />
      <div className="info-address">{encode(props.info.account)}</div>
      <br />
      Account balance:{" "}
      {!isError ? data?.toString() + " ckSat" : "Error " + error}
      <br />
      Your email address: {email ?? "Not verified"}
      <br />
      Gift card balance:{" "}
      {email
        ? !giftCardBalance.isError
          ? giftCardBalance.data?.toString() + " ckSat"
          : "Error " + error
        : "-"}
      <br />
      <form action="#" onSubmit={formWithdraw} className="box">
        <label htmlFor="account">To Account: &nbsp;</label>
        <input id="account" alt="Name" type="text" />
        <label htmlFor="amount">Amount: &nbsp;</label>
        <input id="amount" alt="Amount" type="number" min={90} />
        <label htmlFor="main">From: &nbsp;</label>
        <select id="main">
          <option value="card">
            Gift Cards ({giftCardBalance.data?.toString() ?? "-"} ckSat)
          </option>
          <option value="main">
            Main Account ({data?.toString() ?? "-"} ckSat)
          </option>
        </select>
        <button type="submit">Withdraw</button>
      </form>
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

function replacer(key: any, value: any) {
  if (typeof value === "bigint") {
    return `${value}n`; // Append 'n' to indicate a BigInt
  }
  return value;
}

export default LoggedIn;
