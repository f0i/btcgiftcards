import { useState } from "react";
import {
  BackendActor,
  LedgerActor,
  MinterActor,
  useAuth,
} from "./use-auth-client";
import {
  Account,
  Gift,
  GiftInfo,
} from "../../declarations/backend/backend.did";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AccountInfo from "./AccountInfo";
import { decodeAccount, encodeAccount } from "./utils";
import { Link } from "react-router-dom";
import { ckbtc_ledger } from "../../declarations/ckbtc_ledger";

type Tab = "created" | "new" | "received" | "account";

function LoggedIn({ tab }: { tab: Tab }) {
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

  function handleSubmit(event: any) {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const confirm = event.target.elements.email.value;
    const amount = BigInt(event.target.elements.amount.value);
    const name = event.target.elements.name.value;
    const message = event.target.elements.message.value;
    if (email !== confirm) {
      window.alert("Error: Eamil addresses do not match.");
      return;
    }
    if (
      !window.confirm(
        "Create a giftcard with " +
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
    <div className="main">
      <button id="logout" onClick={logout} className="group">
        🚶‍➡️🚪
        <div className="hidden group-hover:block">Sign out</div>
      </button>
      <div className="content max-w-4xl mb-4">
        <h1>ckBTC Gift Cards</h1>
      </div>
      <div className="flex w-full max-w-4xl space-x-4 overflow-x-auto overflow-y-hidden">
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
          created
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
            <label htmlFor="name">Enter your name: &nbsp;</label>
            <input id="name" alt="Name" type="text" />
            <label htmlFor="email">Recipient Email: &nbsp;</label>
            <input id="email" alt="Email" type="email" />
            <label htmlFor="confirm">Confirm Email: &nbsp;</label>
            <input id="confirm" alt="Email confirm" type="email" />
            <label htmlFor="amount">Amount: &nbsp;</label>
            <select id="amount">
              {/* TODO: get current exchange rate */}
              <option value="1000">1000 ckSat (~1$)</option>
              <option value="1000">5000 ckSat (~5$)</option>
              <option value="10000">10000 ckSat (~10$)</option>
              <option value="10000">20000 ckSat (~20$)</option>
              <option value="100000">50000 ckSat (~50$)</option>
            </select>
            <label htmlFor="message">Enter a message: &nbsp;</label>
            <textarea id="message" rows={5} />
            <div className="w-full bg-blue-100 border border-blue-300 text-blue-800 text-sm rounded-lg p-4 my-2 inline-block">
              ⚠️ <strong>Warning:</strong> The project is still under active
              development. Please avoid loading large amounts onto the gift
              cards at this stage, as there is a risk of funds being lost.
            </div>
            <button type="submit">Create Giftcard!</button>
          </form>
          <section id="giftcard">{result}</section>
        </div>
      )}
      {tab !== "created" ? null : (
        <div className="content max-w-4xl mb-4">
          <section id="giftcards">
            <h3>Created Gift Cards</h3>
            <GiftcardList gifts={data?.created ?? []} />
          </section>
        </div>
      )}
      {tab !== "received" ? null : (
        <div className="content max-w-4xl mb-4">
          <section id="giftcards">
            <h3>Received Gift Cards</h3>
            <GiftcardList gifts={data?.received ?? []} />
          </section>
        </div>
      )}
      {tab !== "account" ? null : (
        <div className="content max-w-4xl mb-4">
          <section id="giftcards">
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
        </div>
      )}
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
        <GiftCard gift={gift} key={gift.id} />
      ))}
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

  // TODO: deduplicate this query to avoid errors when updating the query
  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["userinfo", props.info.account.owner.toString()],
    queryFn: () => {
      return props.ledger.icrc1_balance_of({
        owner: props.info.account.owner,
        subaccount: props.info.account.subaccount,
      });
    },
  });

  // TODO: deduplicate this query to avoid errors when updating the query
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

  const formWithdraw = async (event: any) => {
    event.preventDefault();
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
