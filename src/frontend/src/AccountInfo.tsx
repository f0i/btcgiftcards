import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BackendActor,
  LedgerActor,
  MinterActor,
  useAuth,
} from "./use-auth-client";
import { GiftInfo } from "../../declarations/backend/backend.did";
import { ckbtc_ledger } from "../../declarations/ckbtc_ledger";
import { Account } from "../../declarations/backend/backend.did";
import CopyButton from "./CopyButton";
import { QRCodeSVG } from "qrcode.react";
import { encodeAccount } from "./utils";

function AccountInfo(props: { notify: any }) {
  const { backendActor, minterActor, isAuthenticated, identity } = useAuth();
  const queryClient = useQueryClient();

  const formVerifyEmail = async (event: any) => {
    event.preventDefault();
    const email = "icidentify@gmail.com"; //TODO! set email address
    try {
      const res = await backendActor!.verifyEmail(email);
      console.log(res);
      if ("ok" in res) {
        props.notify("Verified " + res.ok);
        queryClient.invalidateQueries();
      } else {
        props.notify("Error: " + res.err);
      }
    } catch (e) {
      props.notify("Error: " + e);
    }
  };

  const { isLoading, isError, data, refetch, error } = useQuery({
    queryKey: ["giftcards", backendActor, isAuthenticated],
    queryFn: () => {
      if (identity && !identity.getPrincipal().isAnonymous()) {
        return backendActor?.listGiftcards();
      }
      return null;
    },
  });
  return (
    <div className="w-full">
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
  );
}

export default AccountInfo;

function UserInfo(props: {
  info: GiftInfo;
  ledger: LedgerActor;
  backend: BackendActor;
  minter: MinterActor;
}) {
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

  const email = props.info.email[0];

  return (
    <div>
      <br />
      <DepositAddressBTC minter={props.minter} info={props.info} />
      ckBTC deposit account:{" "}
      <CopyButton
        label="Copy ckBTC Deposit Account"
        textToCopy={encodeAccount(props.info.account)}
      />
      <div className="info-address">{encodeAccount(props.info.account)}</div>
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
