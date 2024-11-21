import {
  BackendActor,
  LedgerActor,
  MinterActor,
  useAuth,
} from "./use-auth-client";
import { Gift, GiftInfo } from "../../declarations/backend/backend.did";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AccountInfo from "./AccountInfo";
import { decodeAccount, encodeAccount } from "./utils";
import { Link, useNavigate } from "react-router-dom";
import { ckbtc_ledger } from "../../declarations/ckbtc_ledger";
import { GiftCard } from "./GiftCard";
import { getTheme, ThemeKey } from "./cardThemes";
import { ThemeSelect } from "./ThemeSelect";
import { useState } from "react";
import { queries, queryKeys } from "./queryKeys";
import Showcase from "./Showcase";

type Tab = "created" | "new" | "received" | "account";

function LoggedIn({ tab }: { tab: Tab }) {
  const queryClient = useQueryClient();

  const { backendActor, logout, minterActor, principal } = useAuth();
  const navigate = useNavigate();

  const { data } = useQuery(
    queries.giftcards(queryClient, backendActor, principal),
  );

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const email: string = event.target.elements.email.value;
    const amount: bigint = BigInt(event.target.elements.amount.value);
    const name: string = event.target.elements.name.value;
    const message: string = event.target.elements.message.value;
    const design: string = event.target.elements.cardTheme.value;
    console.log("gift card params:", email, amount, name, message, design);

    if (
      !window.confirm(
        "Create a gift card with " +
          amount +
          " ckSat for " +
          " to " +
          email +
          "?\n\n A total of " +
          (amount + 200n) +
          " ckSat will be deducted from your main account.",
      )
    ) {
      window.alert("Gift card creation canceled.");
      return;
    }
    backendActor!
      .createGiftCard(email, amount, name, message, design)
      .then((gift) => {
        console.log(gift);
        queryClient.invalidateQueries();
        if ("ok" in gift) {
          window.alert("Gift card created successfuly.");
          navigate("/send/" + gift.ok.id);
        } else {
          throw gift.err;
        }
      })
      .catch((err) => {
        window.alert("Failed to create gift card.\n\n" + err);
      });
    return false;
  };

  const [email, setEmail] = useState("");

  const isGmail = (email: string) => {
    if (email.indexOf("@") < 0) return true;
    return email.toLowerCase().trim().endsWith("@gmail.com");
  };

  const balance = useQuery(queries.balance(ckbtc_ledger, data?.account));

  return (
    <div className="main">
      <button id="logout" onClick={logout} className="group">
        🚶‍➡️🚪
        <div className="hidden group-hover:block">Sign out</div>
      </button>
      <div className="content max-w-4xl mb-4">
        <h1>
          BTC<span className=" text-gray-300">-</span>Gift
          <span className="text-gray-300">-</span>Cards
          <span className="text-gray-300 text-base">.com</span>
        </h1>
      </div>
      <div className="flex w-full max-w-4xl space-x-4 overflow-x-auto overflow-y-hidden mb-[-10px] pb-[10px] pt-1">
        <Link
          to="/create"
          className={
            tab === "new" ? "button-tab-active" : "button-tab-inactive"
          }
        >
          Create
        </Link>
        <Link
          to="/received"
          className={
            tab === "received" ? "button-tab-active" : "button-tab-inactive"
          }
        >
          Received
        </Link>
        <Link
          to="/created"
          className={
            tab === "created" ? "button-tab-active" : "button-tab-inactive"
          }
        >
          Created
        </Link>
        <Link
          to="/account"
          className={
            tab === "account" ? "button-tab-active" : "button-tab-inactive"
          }
        >
          Account
        </Link>
      </div>
      {tab !== "new" ? null : (
        <div className="content max-w-4xl mb-4">
          <form action="#" onSubmit={handleSubmit}>
            <h3 className="w-full">New Gift Card</h3>
            <ThemeSelect id="cardTheme" />
            <label htmlFor="name">Enter your name: &nbsp;</label>
            <input id="name" alt="Name" type="text" />
            <label
              hidden={isGmail(email)}
              className="w-full bg-yellow-100 border border-yellow-500 text-yellow-700 p-4 rounded text-base"
            >
              ⚠️ <strong>Warning:</strong> <i>{email}</i> is not a gmail
              address.
              <br />
              You can still use it if the recipient can sign in with google
              using this address.
            </label>
            <label htmlFor="email">Recipient Email: &nbsp;</label>
            <input
              id="email"
              alt="Email"
              type="email"
              onBlur={(e: any) => {
                setEmail(e.target.value);
              }}
              onChange={(e: any) => setEmail("")}
            />
            <label className="w-full text-base text-right">
              Current balance:{" "}
              {balance.isLoading
                ? "loading..."
                : balance.isError || !balance.data
                  ? "-"
                  : balance.data.toString() + " ckSat"}
            </label>
            <label htmlFor="amount">Amount: &nbsp;</label>
            <select id="amount">
              {/* TODO: get current exchange rate */}
              <option value="1000">1000 ckSat (~1$)</option>
              <option value="2222">2222 ckSat (🦆🦆🦆🦆)</option>
              <option value="1000">5000 ckSat (~5$)</option>
              <option value="10000">10000 ckSat (~10$)</option>
              <option value="21000">21000 ckSat (~20$)</option>
              <option value="50000">50000 ckSat (~50$)</option>
            </select>
            <label htmlFor="message">Enter a message: &nbsp;</label>
            <textarea id="message" rows={5} />
            <div className="w-full bg-blue-100 border border-blue-300 text-blue-800 text-base rounded-lg p-4 my-2 inline-block">
              ⚠️ <strong>Warning:</strong> The project is still under active
              development. Please avoid loading large amounts onto the gift
              cards at this stage, as there is a risk of funds being lost.
            </div>
            <button type="submit">Create Gift Card!</button>
          </form>
        </div>
      )}
      {tab !== "received" ? null : (
        <div className="content max-w-4xl mb-4">
          <section id="received" className="min-h-[16em]">
            <h3>Received Gift Cards</h3>
            <GiftcardList
              gifts={data?.received ?? []}
              refundable={data?.refundable ?? []}
              empty="No gift cards received yet."
            />
          </section>
        </div>
      )}
      {tab !== "created" ? null : (
        <div className="content max-w-4xl mb-4">
          <section id="created" className="min-h-[16em]">
            <h3>Created Gift Cards</h3>
            <GiftcardList
              gifts={data?.created ?? []}
              refundable={data?.refundable ?? []}
              empty="No gift cards created yet."
            />
          </section>
        </div>
      )}
      {tab !== "account" ? null : (
        <div className="content max-w-4xl mb-4">
          <section id="withdraw">
            <h3>Account</h3>
            <AccountInfo notify={(_: unknown) => {}} />
            <h3 className="mt-12">Withdraw</h3>
            {!data || !backendActor || !minterActor ? null : (
              <Withdraw
                info={data}
                ledger={ckbtc_ledger}
                backend={backendActor}
                minter={minterActor}
              />
            )}
          </section>
          <section className="mt-16">
            <h3>What to do with ckBTC?</h3>
            <Showcase />
          </section>
        </div>
      )}
    </div>
  );
}

function GiftcardList({
  gifts,
  refundable,
  empty,
}: {
  gifts: Gift[];
  refundable: string[];
  empty: string;
}) {
  if (gifts.length === 0) return <div className="warning mt-2">{empty}</div>;

  return (
    <div>
      {gifts
        .map((gift) => (
          <GiftCard gift={gift} key={gift.id} refundable={refundable} />
        ))
        .reverse()}
    </div>
  );
}

function Withdraw(props: {
  info: GiftInfo;
  ledger: LedgerActor;
  backend: BackendActor;
  minter: MinterActor;
}) {
  const queryClient = useQueryClient();

  const { isLoading, isError, data, error, refetch } = useQuery(
    queries.balance(props.ledger, props.info.account),
  );

  const giftCardBalance = useQuery(
    queries.balance(props.ledger, props.info.accountEmail?.[0]),
  );

  const formWithdraw = async (event: any) => {
    event.preventDefault();
    try {
      const account = event.target.elements.account.value;
      const main = event.target.elements.main.value === "main";
      const amount = BigInt(event.target.elements.amount.value);
      const toAccount = decodeAccount(account);
      if (
        !window.confirm(
          "Withdraw " +
            amount +
            " ckSat from " +
            (main ? "Main account" : "Gift Cards") +
            " to \n" +
            encodeAccount(toAccount) +
            "?",
        )
      ) {
        window.alert("Withdrawl canceled.");
        return;
      }

      const res = await props.backend.withdraw(toAccount, amount, main);
      console.log(res);
      if ("ok" in res) {
        window.alert("Withdrawal was successful!\nTransaction ID " + res.ok);
        queryClient.invalidateQueries();
      } else {
        window.alert("Error: " + res.err);
      }
    } catch (e) {
      window.alert("Could not withdraw: " + e);
      return;
    }
  };

  return (
    <form action="#" onSubmit={formWithdraw}>
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
  );
}

function replacer(key: any, value: any) {
  if (typeof value === "bigint") {
    return `${value}n`; // Append 'n' to indicate a BigInt
  }
  return value;
}

export default LoggedIn;
