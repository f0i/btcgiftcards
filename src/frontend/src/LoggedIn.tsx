import { useAuth } from "./use-auth-client";
import { Gift, SendStatus } from "../../declarations/backend/backend.did";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDateTimeFromNano } from "./utils";
import { GiftCard } from "./GiftCard";
import { queries } from "./queryKeys";
import { Principal } from "@dfinity/principal";
import TopNav, { Tab } from "./components/TopNav";
import { TinyFooter } from "./Footer";
import DataTable from "react-data-table-component";
import { BsLock, BsUnlock } from "react-icons/bs";
import { isRefundable, isRevoked, status } from "./gift";
import Account from "./Account";
import Create from "./Create";
import Withdraw from "./Withdraw";

function LoggedIn({ tab }: { tab: Tab }) {
  const queryClient = useQueryClient();

  const { backendActor, principal } = useAuth();

  const { data } = useQuery(
    queries.giftcards(queryClient, backendActor, principal),
  );

  return (
    <>
      <TopNav tab={tab} />
      <div className="main grow">
        {tab !== "new" ? null : <Create />}
        {tab !== "received" ? null : (
          <div className="content w-max-center mb-4">
            <section id="received" className="min-h-[8em]">
              <h3>Received Gift Cards</h3>
              <GiftcardList
                gifts={data?.received ?? []}
                refundable={[]}
                empty="No gift cards received yet."
                sendStatus={[]}
                principal={principal!}
              />
            </section>
          </div>
        )}
        {tab !== "created" ? null : (
          <div className="content w-max-center mb-4">
            <section id="created" className="min-h-[8em]">
              <h3 className="pb-4">Created Gift Cards</h3>
              <GiftcardTable
                gifts={data?.created ?? []}
                refundable={data?.refundable ?? []}
                empty="No gift cards created yet."
                sendStatus={data?.sendStatus ?? []}
                principal={principal!}
              />
            </section>
          </div>
        )}
        {tab !== "account" ? null : <Account />}
        {tab !== "withdraw" ? null : <Withdraw />}
        {tab !== "learn" ? null : (
          <div className="content w-max-center mb-4">
            <h3>Learn</h3>
            <section className="mt-16">
              <h3>Coming soon</h3>
            </section>
          </div>
        )}
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
}: {
  gifts: Gift[];
  refundable: string[];
  empty: string;
  sendStatus: SendStatus[];
  principal: Principal;
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
              principal={principal}
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
            selector: (gift) => status(gift, sendStatus),
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
              <>
                {isRefundable(gift, refundable) ? (
                  <button className="button-sm">Refund</button>
                ) : null}
                <button className="button-sm">Copy</button>
              </>
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
  sendStatus: SendStatus[];
  principal: Principal;
}) {
  if (gifts.length === 0) return <div className="warning mt-2">{empty}</div>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {gifts
        .map((gift) => (
          <GiftCard
            className="w-full" // TODO fix buttons
            gift={gift}
            key={gift.id}
            refundable={refundable}
            sendStatus={sendStatus}
            principal={principal}
          />
        ))
        .reverse()}
    </div>
  );
}

export default LoggedIn;
