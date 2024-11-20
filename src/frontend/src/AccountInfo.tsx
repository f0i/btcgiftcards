import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BackendActor,
  LedgerActor,
  MinterActor,
  useAuth,
} from "./use-auth-client";
import { GiftInfo } from "../../declarations/backend/backend.did";
import { ckbtc_ledger } from "../../declarations/ckbtc_ledger";
import CopyButton from "./CopyButton";
import { QRCodeSVG } from "qrcode.react";
import { encodeAccount } from "./utils";
import { queryKeys } from "./queryKeys";

function AccountInfo(props: { notify: any }) {
  const { backendActor, minterActor, identity, principal } = useAuth();
  const queryClient = useQueryClient();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: queryKeys.giftcards(principal),
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

export default AccountInfo;

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

  const { isLoading, isError, data, error } = useQuery({
    queryKey: queryKeys.balance(info.account),
    queryFn: () => {
      return ledger.icrc1_balance_of({
        owner: info.account.owner,
        subaccount: info.account.subaccount,
      });
    },
  });

  const giftCardBalance = useQuery({
    queryKey: queryKeys.balance(info.accountEmail?.[0]),
    queryFn: () => {
      if (!info.accountEmail?.[0]) return null;
      return ledger.icrc1_balance_of({
        owner: info.accountEmail[0].owner,
        subaccount: info.accountEmail[0].subaccount,
      });
    },
  });

  const verifyEmail = async (event: any) => {
    event.preventDefault();
    try {
      const res = await backend!.getEmail();
      console.log(res);
      if ("ok" in res) {
        queryClient.invalidateQueries();
      } else {
        window.alert("Error: " + res.err);
      }
    } catch (e) {
      window.alert("Error: " + e);
    }
  };

  const email = info.email[0];

  return (
    <div>
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
      <br />
      <br />
      <DepositAddressBTC minter={minter} info={info} />
      <div className="warning">
        Minting ckBTC using a Bitcoin transaction will take at least one hour (6
        confirmations). Minimum amount should be larger than 55000 SAT to be
        well above the current minimum and cover the KYT fees.
      </div>
      ckBTC deposit account:{" "}
      <CopyButton
        label="Copy ckBTC Deposit Account"
        textToCopy={encodeAccount(info.account)}
      />
      <div className="info-address">{encodeAccount(info.account)}</div>
      <br />
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
      <br />
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
  if (isLoading) return <div>Loading BTC depossit address...</div>;
  // TODO: log error
  if (isError) return <div>Error getting BTC depossit address.</div>;
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
