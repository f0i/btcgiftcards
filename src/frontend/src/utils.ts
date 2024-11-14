import { decodeIcrcAccount, encodeIcrcAccount } from "@dfinity/ledger-icrc";
import {
  Account,
  Gift,
  GiftInfo,
} from "../../declarations/backend/backend.did";

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
