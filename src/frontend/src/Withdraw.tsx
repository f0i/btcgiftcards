import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./use-auth-client";
import { decodeAccount, encodeAccount, shortenErr } from "./utils";
import { ckbtc_ledger } from "../../declarations/ckbtc_ledger";
import { queries } from "./queryKeys";
import toast from "react-hot-toast";
import { confirmDialog } from "./CopyButton";

function Withdraw() {
  const queryClient = useQueryClient();

  const { backendActor, principal } = useAuth();
  const { data: gift } = useQuery(
    queries.giftcards(queryClient, backendActor, principal),
  );

  const account = (gift && "ok" in gift && gift.ok.account) || undefined;

  const { data: balance } = useQuery(queries.balance(ckbtc_ledger, account));

  const formWithdraw = async (event: any) => {
    event.preventDefault();
    try {
      const account = event.target.elements.account.value;
      const toAccount = decodeAccount(account);
      const amount = BigInt(event.target.elements.amount.value);
      await confirmDialog({
        msg: `Withdraw ${amount.toString()} ckSat from your account to:`,
        sub: encodeAccount(toAccount),
      });

      const res = await backendActor?.withdraw(toAccount, amount);
      console.log(res);
      if (!res) throw "not logged in";
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
    <div className="w-max-center">
      <section id="withdraw">
        <h3>Withdraw</h3>
        <form action="#" onSubmit={formWithdraw}>
          <label htmlFor="main">From: &nbsp;</label>
          <input
            id="main"
            value={"Main account (" + (balance ?? "-") + " ckSat)"}
          />
          <label htmlFor="amount">Amount: &nbsp;</label>
          <div className="input-container relative">
            <span className="absolute right-12 top-4">ckSat</span>
            <input type="number" id="amount" placeholder="" min={200} />
          </div>
          <label htmlFor="account">To Account: &nbsp;</label>
          <input id="account" alt="Name" type="text" />
          <div className="px-1/3">
            <button type="submit" className="">
              Withdraw
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Withdraw;
