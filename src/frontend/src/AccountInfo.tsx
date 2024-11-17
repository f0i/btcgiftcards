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
import { queryKeys } from "./queryKeys";

function AccountInfo(props: { notify: any }) {
  const { backendActor, minterActor, identity, principal } = useAuth();
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
        <UserInfo info={data} ledger={ckbtc_ledger} minter={minterActor} />
      )}
    </div>
  );
}

export default AccountInfo;

function UserInfo({
  info,
  ledger,
  minter,
}: {
  info: GiftInfo;
  ledger: LedgerActor;
  minter: MinterActor;
}) {
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

  const email = info.email[0];

  return (
    <div>
      Your email address: {email ?? "Not verified"}
      <br />
      <br />
      <DepositAddressBTC minter={minter} info={info} />
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
