import { useQueryClient } from "@tanstack/react-query";
import { Gift, SendStatusEntry } from "../../declarations/backend/backend.did";
import { useAuth } from "./use-auth-client";
import { formatCurrency, formatDateFromNano, shortenErr } from "./utils";
import { getTheme, ThemeKey } from "./cardThemes";
import { confirmDialog, CopyFormattedContent } from "./CopyButton";
import toast from "react-hot-toast";
import { Principal } from "@dfinity/principal";
import EmailTemplate from "./email/EmailTemplate";
import { Button } from "./components/ui/button";
import { useNavigate } from "react-router-dom";
import { isRevoked, statusText } from "./gift";

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
  let navigate = useNavigate();

  const refund = async () => {
    try {
      await confirmDialog({
        msg: "Do you really want to refund this gift card?",
        sub: "The balance will be transfered back to your main account. Transaction fees will be deducted.",
      });

      // refund amount will be validated in the backend. Passed in to ensure it is as expected, otherwise refund will fail.
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
    <>
      {/*<EmailTemplate
        recipientName={gift.to}
        amount={formatCurrency(gift.amount, 10000000, 0)}
        value={formatCurrency(gift.amount, 1000, 2)}
        senderName={gift.sender}
        customMessage={gift.message}
        theme={gift.design as ThemeKey}
        redeemPath={"/show/" + gift.id}
      />*/}
      <div
        className={
          "border border-2 flex flex-col bg-white rounded-lg " +
          (className ?? "")
        }
      >
        <div className="relative text-gray-500 text-base">
          <div className="card-date absolute w-full text-right p-2">
            {formatDateFromNano(gift.created)}
          </div>
        </div>
        <div className="p-4 bg-stone-200">
          <div className="text-[3em] font-cormorant text-center w-full">
            Bitcoin Gift&nbsp;Card
          </div>
          <img
            className="w-full max-w-full object-cover rounded-lg max-h-[25em] aspect-video"
            src={theme.cover}
          />
        </div>
        <div className="w-full text-center">
          <div className="pt-16">{gift.sender} send you</div>
          <br />
          <div className={revoked ? "line-through" : ""}>
            <div className="font-cormorant text-4xl">
              {formatCurrency(gift.amount, 100000000.0, 0)} Bitcoin
            </div>
            <br />
            Valued at about ${formatCurrency(gift.amount, 1000.0, 2)}
          </div>
        </div>
        <div className="text-center grow py-8 font-bold">
          {gift.message.split("\n").map((line, index) => (
            <p style={{ margin: 0 }} key={index}>
              {line.length > 0 ? line : <>&nbsp;</>}
            </p>
          ))}
        </div>
        <div className="text-center grow py-4">
          This Gift card is linked to {gift.to}
          <br />
          <br />
          {isPreview ? (
            <Button>CLAIM YOUR BITCOIN</Button>
          ) : isRevoked(gift, sendStatus) ? (
            <Button className="line-through">CLAIM YOUR BITCOIN</Button>
          ) : (
            <Button onClick={() => navigate("/show/" + gift.id)}>
              CLAIM YOUR BITCOIN
            </Button>
          )}
        </div>
        {revoked ? (
          <div className="warning w-full">
            ⚠️ <strong>Warning:</strong> This Card has been revoked.
          </div>
        ) : null}
        <div className="w-full flex felx-row space-x-2 justify-end mt-8 p-4">
          {showRefund ? (
            <Button variant="destructive" onClick={refund}>
              Refund
            </Button>
          ) : null}
          {canCancel ? (
            <Button
              onClick={() => {
                requestSend(false);
              }}
              variant="outline"
            >
              Cancel Send Request
            </Button>
          ) : null}
          {canRequestSend ? (
            <Button
              onClick={() => {
                requestSend(true);
              }}
              variant="outline"
            >
              Request Send by Email
            </Button>
          ) : null}
          {revoked ? null : (
            <CopyFormattedContent gift={gift} isPreview={isPreview} />
          )}
        </div>
      </div>
    </>
  );
};
