import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BackendActor,
  LedgerActor,
  MinterActor,
  useAuth,
} from "./use-auth-client";
import { GiftInfo } from "../../declarations/backend/backend.did";
import { ckbtc_ledger } from "../../declarations/ckbtc_ledger";
import { CopyButton } from "./CopyButton";
import { QRCodeSVG } from "qrcode.react";
import { encodeAccount, shortenErr } from "./utils";
import { queries, queryKeys } from "./queryKeys";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function Account(props: {}) {
  const { backendActor, minterActor, principal } = useAuth();
  const queryClient = useQueryClient();

  const { isLoading, isError, data, error } = useQuery(
    queries.giftcards(queryClient, backendActor, principal),
  );

  return (
    <div className="max-w-center">
      {isLoading ? "loading..." : isError ? "Error " + error : ""}
      {data && backendActor && minterActor && (
        <UserInfo
          info={data}
          ledger={ckbtc_ledger}
          minter={minterActor}
          backend={backendActor}
        />
      )}
    </div>
  );
}

export default Account;

function UserInfo({
  info,
  ledger,
  minter,
  backend,
}: {
  info: GiftInfo;
  ledger: LedgerActor;
  minter: MinterActor;
  backend: BackendActor;
}) {
  const queryClient = useQueryClient();

  const { isLoading, isError, data, error } = useQuery(
    queries.balance(ledger, info.account),
  );

  const giftCardBalance = useQuery(
    queries.balance(ledger, info.accountEmail?.[0]),
  );

  const verifyEmail = async (event: any) => {
    event.preventDefault();
    try {
      const res = await backend!.getEmail();
      console.log(res);
      if ("ok" in res) {
        toast.success("Verified " + res.ok);
        queryClient.invalidateQueries();
      } else {
        toast.error("Failed to verify email:\n" + shortenErr(res.err));
      }
    } catch (e: any) {
      toast.error("Failed to verify email:\n" + shortenErr(e));
    }
  };

  const email = info.email[0];

  return (
    <div>
      <h3 className="mt-8">Personal Information</h3>
      Your email address:{" "}
      {email ? (
        email
      ) : (
        <>
          Not verified
          <button className="button-sm-green" onClick={verifyEmail}>
            Verify Email Address
          </button>
        </>
      )}
      <h3 className="mt-8">ckBTC</h3>
      <p>
        You need ckBTC to create new gift cards. You can either deposit your
        ckBTC your personal account shown below, or connect a wallet with ckBTC
        in it. See{" "}
        <Link to="/learn/ckbtc" className="link text-blue-700">
          About ckBTC
        </Link>{" "}
        to learn how to get and deposit ckBTC.
      </p>
      {/*
        // disabel ckBTC minting, creator of Gift Cards should go through the NNS to Mint ckBTC!
        <>
          <DepositAddressBTC minter={minter} info={info} />
          <div className="warning">
            Minting ckBTC using a Bitcoin transaction will take{" "}
            <b>at least one hour</b> (6 confirmations). A{" "}
            <b>minimum amount of 0.00055 BTC</b> (55000 Sat) or more should be
            transfered to be well above the current minimum and cover the KYT
            fees. Bitcoin transaction fees apply.{" "}
            <a
              href="https://wiki.internetcomputer.org/wiki/Chain-key_Bitcoin"
              target="_blank"
            >
              Learn more about ckBTC
            </a>
          </div>
        </>
     */}
      <h3 className="mt-8">Deposit ckBTC</h3>
      ckBTC deposit account:{" "}
      <CopyButton
        label="Copy ckBTC Deposit Account"
        textToCopy={encodeAccount(info.account)}
      />
      <div className="info-address">{encodeAccount(info.account)}</div>
      Account balance:{" "}
      {isLoading
        ? "loading..."
        : isError
          ? "Error: " + error
          : data?.toString() + " ckSat"}
      <br />
      Gift card balance:{" "}
      {!email
        ? "-"
        : giftCardBalance.isLoading
          ? "loading..."
          : giftCardBalance.isError
            ? "Error: " + error
            : giftCardBalance.data?.toString() + " ckSat"}
      <h3 className="mt-8">Connect your own wallet</h3>
      If you already have ckBTC in your own wallet, you can connect it here:
      <div className="flex flex-row gap-4 py-4">
        <button className="button w-32">
          <img className="h-16" src="/external/plug.svg" />
          Plug wallet
        </button>
        <button className="button w-32">
          <img className="h-16" src="/external/stoic.svg" />
          Stoic wallet
        </button>
      </div>
    </div>
  );
}

function DepositAddressBTC(props: { info: GiftInfo; minter: MinterActor }) {
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
  if (isLoading) return <div>Loading BTC deposit address...</div>;
  // TODO: log error
  if (isError) return <div>Error getting BTC deposit address.</div>;
  if (!data) return <div>No Data received</div>;
  return <BTCQRCode btcAddress={data} />;
}

const BTCQRCode = ({ btcAddress }: { btcAddress: string }) => {
  const btcUri = `bitcoin:${btcAddress}`;

  return (
    <div className="">
      BTC deposit account:{" "}
      <CopyButton label="Copy BTC Deposit Address" textToCopy={btcAddress} />
      <br />
      <div className="info-address min-height-200 flex-row">
        <span className="max-w-600 flex-grow">{btcAddress}</span>
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
