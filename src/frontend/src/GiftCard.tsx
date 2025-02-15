import { useQueryClient } from "@tanstack/react-query";
import { Gift, SendStatusEntry } from "../../declarations/backend/backend.did";
import { useAuth } from "./use-auth-client";
import { formatDateFromNano, shortenErr } from "./utils";
import { getTheme } from "./cardThemes";
import { confirmDialog, CopyFormattedContent } from "./CopyButton";
import toast from "react-hot-toast";
import { Principal } from "@dfinity/principal";

export const GiftCard = ({
  gift,
  refundable,
  sendStatus,
  principal,
  className,
  isPreview,
}: {
  gift: Gift;
  refundable: string[];
  sendStatus: SendStatusEntry[];
  principal?: Principal;
  className?: string;
  isPreview?: boolean;
}) => {
  let { backendActor } = useAuth();
  let queryClient = useQueryClient();

  const refund = async () => {
    try {
      await confirmDialog({
        msg: "Do you really want to refund this gift card?",
        sub: "The balance will be transfered back to your main account. Transaction fees will be deducted.",
      });

      let res = await backendActor!.refund(gift.id, gift.amount - 10n);
      if ("ok" in res) {
        toast.success("Refund successful");
        queryClient.invalidateQueries();
      } else {
        throw res.err;
      }
    } catch (e: any) {
      toast.error("Refund failed:\n" + shortenErr(e));
    }
  };

  const requestSend = async (request: boolean) => {
    try {
      if (request) {
        await confirmDialog({
          msg:
            "The gift card will be manually reviewd and send to " +
            gift.to +
            "?",
          sub: "This can take several hours or days! You can also copy the card and send it your self.",
        });
      }

      let res = await backendActor!.addToEmailQueue(gift.id, request);
      if ("ok" in res) {
        toast.success("Queue updated successfully:\n" + res.ok);
        queryClient.invalidateQueries();
      } else {
        throw res.err;
      }
    } catch (e: any) {
      toast.error("Request was not send:\n" + shortenErr(e));
    }
  };

  const theme = getTheme(gift.design);
  const showRefund = refundable.indexOf(gift.id) >= 0;
  const status = sendStatus.find((stat) => stat.id === gift.id) ?? {
    id: gift.id,
    status: "unknown",
  };
  const canRequestSend =
    gift.creator.toString() === principal?.toString() &&
    (status.status === "init" || status.status === "sendCancel");
  const canCancel =
    gift.creator.toString() === principal?.toString() &&
    status?.status === "sendRequest";
  const revoked =
    status.status === "cardRevoked" || status.status === "cardRevoking";
  console.log("status", status, canRequestSend);
  if (revoked) return null;

  return (
    <div
      className={
        "border border-2 p-4 flex flex-col bg-white rounded-lg " +
        (className ?? "")
      }
    >
      <div className="relative text-gray-500 text-base">
        <div className="card-date">{formatDateFromNano(gift.created)}</div>
        <div>To: {gift.to}</div>
      </div>
      <img
        className="w-full max-w-full object-cover rounded-lg max-h-[25em] aspect-video"
        src={theme.cover}
      />
      <br />
      <div>You received a gift from {gift.sender}</div>
      <br />
      <div className={revoked ? "line-through" : ""}>
        Value: <strong>{gift.amount.toString()} ckSat</strong> (={" "}
        {Number(gift.amount) / 100000000.0} Bitcoin)
      </div>
      <br />
      Visit the following link to redeem it:
      <br />
      {isPreview ? (
        <span className="link text-blue-900">
          {document.location.origin}/show/xxxxxxxxxxxxxxxx
        </span>
      ) : (
        <a
          href={"/show/" + gift.id}
          target="_blank"
          className="link text-blue-900"
        >
          {document.location.origin}/show/{gift.id}
        </a>
      )}
      <br />
      <br />
      <strong>Message from {gift.sender}:</strong>
      <div className="text-pre grow">{gift.message}</div>
      {revoked ? (
        <div className="warning w-full">
          ⚠️ <strong>Warning:</strong> This Card has been revoked.
        </div>
      ) : null}
      <div className="w-full flex felx-row space-x-2 justify-end mt-8">
        {showRefund ? (
          <button onClick={refund} className="button w-32">
            Refund
          </button>
        ) : null}
        {canCancel ? (
          <button
            onClick={() => {
              requestSend(false);
            }}
            className="button"
          >
            Cancel Send Request
          </button>
        ) : null}
        {canRequestSend ? (
          <button
            onClick={() => {
              requestSend(true);
            }}
            className="button"
          >
            Request Send by Email
          </button>
        ) : null}
        {revoked ? null : (
          <CopyFormattedContent gift={gift} isPreview={isPreview} />
        )}
      </div>
    </div>
  );
};
