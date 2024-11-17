import { Principal } from "@dfinity/principal";
import { Account, GiftInfo } from "../../declarations/backend/backend.did";
import { encodeAccount } from "./utils";

export const queryKeys = {
  giftcards: (principal?: Principal) => ["giftcards", principal],
  userinfo: (info: GiftInfo) => ["userinfo", encodeAccountOrNull(info.account)],
  balance: (account?: Account) => ["balance", encodeAccountOrNull(account)],
};

const encodeAccountOrNull = (account?: Account) => {
  if (!account) return null;
  try {
    return encodeAccount(account);
  } catch (e) {
    console.log("invalid account for query key:", account);
    return null;
  }
};
