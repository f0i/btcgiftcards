import {
  BackendActor,
  LedgerActor,
  MinterActor,
  useAuth,
} from "./use-auth-client";
import {
  Gift,
  GiftInfo,
  SendStatus,
} from "../../declarations/backend/backend.did";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import AccountInfo from "./AccountInfo";
import { decodeAccount, encodeAccount, shortenErr } from "./utils";
import { Link, useNavigate } from "react-router-dom";
import { ckbtc_ledger } from "../../declarations/ckbtc_ledger";
import { GiftCard } from "./GiftCard";
import { ThemeSelect } from "./ThemeSelect";
import { useState } from "react";
import { queries, mutations } from "./queryKeys";
import Showcase from "./Showcase";
import toast from "react-hot-toast";
import { confirmDialog } from "./CopyButton";
import { Principal } from "@dfinity/principal";

type Tab = "created" | "new" | "received" | "account";

function LoggedIn({ tab }: { tab: Tab }) {
  const queryClient = useQueryClient();

  const { backendActor, logout, minterActor, principal } = useAuth();
  const navigate = useNavigate();

  const { data } = useQuery(
    queries.giftcards(queryClient, backendActor, principal),
  );

  const createGiftCardMutation = useMutation({
    ...mutations.createGiftCard(backendActor!),
    onSuccess: (gift) => {
      queryClient.invalidateQueries();
      toast.success("Gift card created successfully");
      navigate("/send/" + gift.id);
    },
    onError: (err) => {
      toast.error("Failed to create gift card: " + shortenErr(err));
    },
  });

  const [useCustomAmount, setUseCustomAmount] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const email: string = event.target.elements.email.value;
    var amount: bigint = BigInt(event.target.elements.amount.value);
    if (useCustomAmount) {
      amount = BigInt(event.target.elements.customAmount.value);
    }
    var fee: bigint = amount >= 10000n ? (amount * 1n) / 100n : 10n; // 1% fee
    const name: string = event.target.elements.name.value;
    const message: string = event.target.elements.message.value;
    const design: string = event.target.elements.cardTheme.value;

    if (createGiftCardMutation.isPending) {
      return;
    }
    console.log("gift card params:", email, amount, name, message, design);

    function isValidEmail(email: string) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }

    if (!isValidEmail(email)) {
      toast.error("Invalid email address.");
      return;
    }

    await confirmDialog({
      msg:
        "Create a gift card with " +
        amount.toString() +
        " ckSat for " +
        email +
        "?",
      sub:
        "A total of " +
        (amount + fee).toString() +
        " ckSat will be deducted from your main account.",
    });

    if (createGiftCardMutation.isPending) {
      return;
    }

    createGiftCardMutation.mutate({
      email,
      amount,
      fee,
      name,
      message,
      design,
    });
    return false;
  };

  const [email, setEmail] = useState("");

  const isGmail = (email: string) => {
    if (email.indexOf("@") < 0) return true;
    return email.toLowerCase().trim().endsWith("@gmail.com");
  };

  const balance = useQuery(queries.balance(ckbtc_ledger, data?.account));

  const handleAmountChange = (e: any) => {
    console.log("Selected amount", e.target.value);
    setUseCustomAmount(e.target.value === "0");
  };

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
              ⚠️ <strong>Warning:</strong> <i>{email}</i> is not a Gmail
              address. You can still use it if the recipient can "sign in with
              google" using this address. You will be able to refund until the
              first successful sign in with that email address.
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
                : balance.isError ||
                    balance.data === null ||
                    balance.data === undefined
                  ? "-"
                  : balance.data.toString() + " ckSat"}
            </label>
            <label htmlFor="amount">Amount: &nbsp;</label>
            <select id="amount" onChange={handleAmountChange}>
              {/* TODO: get current exchange rate */}
              <option value="1000">1000 ckSat (~1$)</option>
              <option value="2222">2222 ckSat (🦆🦆🦆🦆)</option>
              <option value="1000">5000 ckSat (~5$)</option>
              <option value="10000">10000 ckSat (~10$)</option>
              <option value="21000">21000 ckSat (~21$)</option>
              <option value="50000">50000 ckSat (~50$)</option>
              <option value="0">Custom Amount...</option>
            </select>
            <div className="w-full" hidden={!useCustomAmount}>
              <label />
              <div className="input-container relative">
                <span className="absolute right-12 top-4">ckSat</span>
                <input
                  type="number"
                  id="customAmount"
                  placeholder=""
                  min={500}
                  max={100000}
                />
              </div>
            </div>
            <label htmlFor="message">Enter a message: &nbsp;</label>
            <textarea id="message" rows={5} />
            <div className="w-full bg-blue-100 border border-blue-300 text-blue-800 text-base rounded-lg p-4 my-2 inline-block">
              ⚠️ <strong>Warning:</strong> The project is still under active
              development. Please avoid loading large amounts onto the gift
              cards at this stage, as there is a risk of funds being lost.
            </div>
            <button
              type="submit"
              disabled={createGiftCardMutation.isPending}
              className={
                createGiftCardMutation.isPending
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            >
              {createGiftCardMutation.isPending
                ? "Creating..."
                : "Create Gift Card!"}
            </button>
          </form>
        </div>
      )}
      {tab !== "received" ? null : (
        <div className="content max-w-4xl mb-4">
          <section id="received" className="min-h-[16em]">
            <h3>Received Gift Cards</h3>
            <GiftcardList
              gifts={data?.received ?? []}
              refundable={[]}
              empty="No gift cards received yet."
              sendStatus={[]}
              principal={principal!}
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
              sendStatus={data?.sendStatus ?? []}
              principal={principal!}
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
  sendStatus,
  principal,
}: {
  gifts: Gift[];
  refundable: string[];
  empty: string;
  sendStatus: SendStatus[];
  principal: Principal;
}) {
  if (gifts.length === 0) return <div className="warning mt-2">{empty}</div>;

  return (
    <div className="flex flex-row flex-wrap gap-4">
      {gifts
        .map((gift) => (
          <GiftCard
            className="TODO:w-[calc(50%-1em)]" // TODO fix buttons
            gift={gift}
            key={gift.id}
            refundable={refundable}
            sendStatus={sendStatus}
            principal={principal}
          />
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
      await confirmDialog({
        msg: `Withdraw ${amount.toString()} ckSat from ${main ? "Main account" : "Gift Cards"} to:`,
        sub: encodeAccount(toAccount),
      });

      const res = await props.backend.withdraw(toAccount, amount, main);
      console.log(res);
      if ("ok" in res) {
        toast.success("Withdrawal successful!\nTransaction ID " + res.ok);
        queryClient.invalidateQueries();
      } else {
        toast.error("Could not withdraw: " + shortenErr(res.err));
      }
    } catch (e: any) {
      toast.error("Could not withdraw: " + shortenErr(e));
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
