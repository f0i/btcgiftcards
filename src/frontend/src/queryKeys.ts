import { Principal } from "@dfinity/principal";
import { Account, GiftInfo } from "../../declarations/backend/backend.did";
import { encodeAccount } from "./utils";
import { BackendActor, LedgerActor } from "./use-auth-client";
import { QueryClient } from "@tanstack/react-query";

export const queryKeys = {
  giftcards: (principal?: Principal) => ["giftcards", principal],
  userinfo: (info: GiftInfo) => ["userinfo", encodeAccountOrNull(info.account)],
  balance: (account?: Account) => ["balance", encodeAccountOrNull(account)],
  show: (id: string, account?: Account) => [
    "show",
    id,
    encodeAccountOrNull(account),
  ],
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

export const queries = {
  giftcards: (
    queryClient: QueryClient,
    backend?: BackendActor,
    principal?: Principal,
  ) => {
    return {
      queryKey: queryKeys.giftcards(principal),
      queryFn: async () => {
        if (backend && principal && !principal.isAnonymous()) {
          var res = await backend.listGiftcards();
          console.log(res);
          if (res.email.length === 0) {
            // don't await! This should not stop user from other interactions
            backend.getEmail().then((emailRes) => {
              if ("ok" in emailRes) {
                queryClient.invalidateQueries();
              } else {
                console.log("Error verifying email:", emailRes.err);
              }
            });
          }
          return res;
        }
        return null;
      },
    };
  },
  balance: (ledger: LedgerActor, account?: Account) => {
    return {
      queryKey: queryKeys.balance(account),
      queryFn: () => {
        if (!account) return null;
        return ledger.icrc1_balance_of({
          owner: account.owner,
          subaccount: account.subaccount,
        });
      },
    };
  },
};
