import { useAuth } from "./use-auth-client";
import { Gift, SendStatusEntry } from "../../declarations/backend/backend.did";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDateTimeFromNano, shortenErr } from "./utils";
import { GiftCard } from "./GiftCard";
import { queries } from "./queryKeys";
import { Principal } from "@dfinity/principal";
import TopNav, { Tab } from "./components/TopNav";
import { TinyFooter } from "./Footer";
import DataTable from "react-data-table-component";
import { BsLock, BsUnlock } from "react-icons/bs";
import { isRefundable, isRevoked, statusText } from "./gift";
import Account from "./Account";
import Create from "./Create";
import { PageLoading } from "./PageLoading";
import { confirmDialog, CopyButton } from "./CopyButton";
import toast from "react-hot-toast";
import { CopyFormattedContent } from "./CopyButton";
import { Button } from "./components/ui/button";

function LoggedIn({ tab }: { tab: Tab }) {
  const queryClient = useQueryClient();

  const { backendActor, principal } = useAuth();

  const { data, isLoading, isError, error, failureCount } = useQuery(
    queries.giftcards(queryClient, backendActor, principal),
  );

  const refund = async (gift: Gift) => {
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

  return (
    <>
      <TopNav tab={tab} />
      <div className="main grow">
        {tab !== "new" ? null : <Create />}
        {tab !== "received" ? null : (
          <div className="content w-max-center mb-4">
            <section id="received" className="min-h-[8em]">
              <h3>Received Gift Cards</h3>
              {data && "ok" in data ? (
                <GiftcardList
                  gifts={data.ok.received}
                  refundable={[]}
                  empty="No gift cards received yet."
                  sendStatus={data.ok.sendStatus}
                  principal={principal!}
                />
              ) : (
                <PageLoading
                  isLoading={isLoading}
                  isError={isError}
                  error={error}
                  failureCount={failureCount}
                />
              )}
            </section>
          </div>
        )}
        {tab !== "created" ? null : (
          <div className="content w-max-center mb-4">
            <section id="created" className="min-h-[8em]">
              <h3 className="pb-4">Created Gift Cards</h3>
              {data && "ok" in data ? (
                <GiftcardTable
                  gifts={data.ok.created}
                  refundable={data.ok.refundable}
                  empty="No gift cards created yet."
                  sendStatus={data.ok.sendStatus}
                  principal={principal!}
                  onRefund={refund}
                  myEmail={data.ok.email}
                />
              ) : (
                <PageLoading
                  isLoading={isLoading}
                  isError={isError}
                  error={error}
                  failureCount={failureCount}
                />
              )}
            </section>
          </div>
        )}
        {tab !== "account" ? null : <Account />}
      </div>
      <TinyFooter />
    </>
  );
}

function GiftcardTable({
  gifts,
  refundable,
  empty,
  sendStatus,
  principal,
  onRefund,
  myEmail,
}: {
  gifts: Gift[];
  refundable: string[];
  empty: string;
  sendStatus: SendStatusEntry[];
  principal: Principal;
  onRefund: (gift: Gift) => void;
  myEmail: string;
}) {
  if (gifts.length === 0) return <div className="warning mt-2">{empty}</div>;

  return (
    <div className="w-full">
      <DataTable
        className=""
        conditionalRowStyles={[
          {
            when: (gift: Gift) => isRevoked(gift, sendStatus),
            style: {
              backgroundColor: "#f5f5f5",
              color: "#9e9e9e",
              textDecoration: "line-through",
            },
          },
        ]}
        expandableRows
        expandableRowDisabled={(gift) => isRevoked(gift, sendStatus)}
        expandableRowsComponent={(gift) => (
          <div className="bg-gray-200">
            <GiftCard
              className="w-full max-w-lg m-auto"
              gift={gift.data}
              key={gift.data.id}
              refundable={refundable}
              sendStatus={sendStatus}
              hideRevoked={true}
              principal={principal}
              isForMe={myEmail === gift.data.to}
            />
          </div>
        )}
        columns={[
          {
            name: "Created",
            selector: (gift) => formatDateTimeFromNano(gift.created),
            width: "200px",
            sortable: true,
          },
          {
            name: "Amount",
            selector: (gift) => gift.amount.toString(),
            width: "100px",
            sortable: true,
          },
          {
            name: "To",
            selector: (gift) => gift.to,
            width: "300px",
            sortable: true,
          },
          {
            name: "Message",
            selector: (gift) => gift.message.substring(0, 200),
            style: { width: "30px" },
          },
          {
            name: "Status",
            selector: (gift) => statusText(gift, sendStatus),
            width: "100px",
            style: { margin: "auto" },
          },
          {
            name: "Refundable",
            selector: (gift) => (isRefundable(gift, refundable) ? "1" : "0"),
            cell: (gift) => (
              <>
                {isRefundable(gift, refundable) ? (
                  <BsUnlock className="text-green-500 m-auto" />
                ) : (
                  <BsLock className="text-red-500 m-auto" />
                )}
              </>
            ),

            width: "130px",
            sortable: true,
          },
          {
            name: "Actions",
            width: "200px",
            cell: (gift) => (
              <div className="flex flex-row gap-2">
                {isRefundable(gift, refundable) ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRefund(gift)}
                  >
                    Refund
                  </Button>
                ) : null}
                {isRevoked(gift, sendStatus) ? null : (
                  <CopyFormattedContent gift={gift} size="sm" label="Copy" />
                )}
              </div>
            ),
          },
        ]}
        data={gifts}
      />
    </div>
  );
}

function GiftcardList({
  gifts,
  refundable,
  empty,
  sendStatus,
  principal,
}: {
  gifts: Gift[];
  refundable: string[];
  empty: string;
  sendStatus: SendStatusEntry[];
  principal: Principal;
}) {
  if (gifts.length === 0) return <div className="warning mt-2">{empty}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {gifts
        .map((gift) => (
          <GiftCard
            className="w-full" // TODO fix buttons
            gift={gift}
            key={gift.id}
            refundable={refundable}
            sendStatus={sendStatus}
            hideRevoked={true}
            principal={principal}
          />
        ))
        .reverse()}
    </div>
  );
}

export default LoggedIn;
