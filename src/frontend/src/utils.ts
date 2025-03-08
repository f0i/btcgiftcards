import { decodeIcrcAccount, encodeIcrcAccount } from "@dfinity/ledger-icrc";
import { Account } from "../../declarations/backend/backend.did";

export const encodeAccount = (account: Account): string => {
  return encodeIcrcAccount({
    owner: account.owner,
    subaccount: account.subaccount?.[0],
  });
};
export const decodeAccount = (account: string): Account => {
  let icrcAccount = decodeIcrcAccount(account);
  return {
    owner: icrcAccount.owner,
    subaccount: icrcAccount.subaccount ? [icrcAccount.subaccount] : [],
  };
};

export const formatDateFromNano = (time: bigint): string => {
  const date = new Date(Number(time / 1_000_000n));
  return date.toISOString().substring(0, 10);
};

export const formatDateTimeFromNano = (time: bigint): string => {
  const date = new Date(Number(time / 1_000_000n));
  return date.toLocaleString();
};

export const formatCurrency = (
  val: bigint,
  div: number,
  decimals: number,
): string => {
  if (decimals == 0) return (Number(val) / div).toString();
  if (decimals > 0) return (Number(val) / div).toFixed(decimals);
  return (Number(val) / div).toPrecision(-decimals);
};

export const shortenErr = (err: string | Error) => {
  const full = err.toString();
  const line = full.split("\n")[0];
  console.log(full, null, line);
  const parts = line.split(":");
  return parts[parts.length - 1];
};

export const stringify = (data: any): string => {
  return JSON.stringify(data, replacer);
};

function replacer(_key: any, value: any) {
  if (typeof value === "bigint") {
    return `${value}n`; // Append 'n' to indicate a BigInt
  }
  return value;
}
