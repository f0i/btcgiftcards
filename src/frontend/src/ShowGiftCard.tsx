import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { queries, queryKeys } from "./queryKeys";
import { useAuth } from "./use-auth-client";
import { GiftCard } from "./GiftCard";
import toast from "react-hot-toast";
import { shortenErr } from "./utils";
import TopNav from "./components/TopNav";
import { TinyFooter } from "./Footer";
import { Button } from "./components/ui/button";

const ShowGiftCard = () => {
  const { giftId } = useParams();
  const { backendActor, logout, login, isAuthenticated, principal } = useAuth();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: queryKeys.show(giftId!, undefined),
    queryFn: async () => {
      const res = await backendActor!.showGiftcard(giftId!);
      if (res?.length == 1) {
        return res[0];
      } else {
        throw "Gift card not found";
      }
    },
    enabled: !!giftId,
  });

  const queryClient = useQueryClient();
  const info = useQuery(
    queries.giftcards(queryClient, backendActor, principal),
  );

  const formVerifyEmail = async (event: any) => {
    event.preventDefault();
    try {
      const origin = document.location.origin;
      const res = await backendActor!.getEmail(origin);
      console.log(res);
      if ("ok" in res) {
        toast.success("Verified " + res.ok);
        queryClient.invalidateQueries();
      } else {
        toast.error("Could not verify email address:\n" + shortenErr(res.err));
      }
    } catch (e: any) {
      toast.error("Could not verify email address:\n" + shortenErr(e));
    }
  };

  const isEmailVerified = info.data && "ok" in info.data;
  const isForMe =
    info.data && "ok" in info.data && info.data?.ok.email === data?.gift.to;
  const isGmail =
    !data ||
    isForMe ||
    data.gift.to.endsWith("gmail.com") ||
    data.gift.to.endsWith("google.com") ||
    data.gift.to.endsWith("googlemail.com") ||
    data.gift.to.endsWith("googlemail.co.uk") ||
    data.gift.to.endsWith("googleworkspace.com");

  const changeAccount = async (e: any) => {
    try {
      e.preventDefault();
    } catch (e) {}
    await logout();
    await login(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav tab="account" />
      <div className="w-max-center pb-4 min-h-72 grow">
        {isLoading ? (
          "Loading gift card " + giftId + "..."
        ) : isError ? (
          "Error: " + error
        ) : (
          <GiftCard
            gift={data!.gift}
            refundable={
              (info.data && "ok" in info.data && info.data.ok.refundable) || []
            }
            sendStatus={
              data ? [{ id: data.gift.id, status: data.sendStatus }] : []
            }
            principal={principal}
            className="max-w-2xl m-auto mt-8"
          />
        )}
        <br />
        {isGmail ? null : (
          <div className="warning">
            Looks like this card is for a non Gmail address. To redeem card, you
            have sign in to google using the same address. See{" "}
            <a
              className="link text-blue-900"
              href="https://support.google.com/accounts/answer/176347"
            >
              support.google.com
            </a>{" "}
            for instructions.
          </div>
        )}
        <div className="text-center">
          {isAuthenticated ? (
            isEmailVerified ? (
              isForMe ? null : (
                <div>
                  The gift card is assigned to another email address.
                  <br />
                  <br />
                  <Button
                    onClick={changeAccount}
                    className="mx-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition duration-200 mb-4"
                  >
                    Change Account
                  </Button>
                </div>
              )
            ) : (
              <div>
                Your email address could not be verified
                <br />
                <Button
                  onClick={changeAccount}
                  className="mx-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition duration-200 mb-4"
                >
                  Change Account
                </Button>
              </div>
            )
          ) : (
            <div>
              Sign in to redeem.
              <br />
              <br />
              <Button
                onClick={() => login(true)}
                className="mx-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-200 mb-4"
              >
                Sign In with Google
              </Button>
            </div>
          )}
        </div>
      </div>
      <TinyFooter />
    </div>
  );
};

export default ShowGiftCard;
