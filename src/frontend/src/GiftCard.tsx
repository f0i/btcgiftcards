import { useQueryClient } from "@tanstack/react-query";
import { Gift } from "../../declarations/backend/backend.did";
import { useAuth } from "./use-auth-client";
import { formatDateFromNano } from "./utils";
import { getTheme } from "./cardThemes";

export const GiftCard = ({
  gift,
  refundable,
}: {
  gift: Gift;
  refundable: string[];
}) => {
  let { backendActor } = useAuth();
  let queryClient = useQueryClient();

  const refund = async () => {
    try {
      if (
        !window.confirm(
          "Do you really want to refund this gift card?\n\nThe balance will be transfered back to your main account. Transaction fees will be deducted.",
        )
      ) {
        return;
      }
      let res = await backendActor!.refund(gift.id, gift.amount - 10n);
      if ("ok" in res) {
        window.alert("Refund successfull");
        queryClient.invalidateQueries();
      } else {
        throw res.err;
      }
    } catch (e) {
      window.alert("Refund failed: " + e);
    }
  };

  const theme = getTheme(gift.design);
  const showRefund = refundable.indexOf(gift.id) >= 0;

  return (
    <div className="card relative break-all">
      <div className="relative text-gray-500 text-lg">
        <div className="card-date">{formatDateFromNano(gift.created)}</div>
        <div>To: {gift.to}</div>
      </div>
      <img
        className="w-full max-w-full object-cover rounded-lg max-h-[25em]"
        src={theme.cover}
      />
      <br />
      <div>You received a gift from {gift.sender}</div>
      <br />
      <div>
        Value: <strong>{gift.amount.toString()} ckSat</strong> (={" "}
        {Number(gift.amount) / 100000000.0} Bitcoin)
      </div>
      <br />
      Visit the following link to redeem it:
      <br />
      <a
        href={"/show/" + gift.id}
        target="_blank"
        className="link text-blue-900"
      >
        {document.location.origin}/show/{gift.id}
      </a>
      <br />
      <br />
      <strong>Message from {gift.sender}:</strong>
      <div>{gift.message}</div>
      {showRefund ? (
        <button onClick={refund} className="button absolute right-3 bottom-4">
          Refund
        </button>
      ) : null}
    </div>
  );
};
