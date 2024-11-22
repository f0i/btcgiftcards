import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { queries, queryKeys } from "./queryKeys";
import { useAuth } from "./use-auth-client";
import { GiftCard } from "./GiftCard";
import { CopyFormattedContent } from "./CopyButton";
import toast from "react-hot-toast";
import { shortenErr } from "./utils";

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
      const res = await backendActor!.getEmail();
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

  const isEmailVerified = !!info.data?.accountEmail?.[0];
  const isForMe = info.data?.accountEmail?.[0] === data?.to;
  const isGmail =
    !data ||
    isForMe ||
    data.to.endsWith("gmail.com") ||
    data.to.endsWith("google.com") ||
    data.to.endsWith("googlemail.com") ||
    data.to.endsWith("googlemail.co.uk") ||
    data.to.endsWith("googleworkspace.com");

  const changeAccount = async (e: any) => {
    try {
      e.preventDefault();
    } catch (e) {}
    await logout();
    await login();
  };

  return (
    <div className="main">
      <div className="content max-w-4xl mb-4">
        <h1>
          BTC<span className=" text-gray-300">-</span>Gift
          <span className="text-gray-300">-</span>Cards
          <span className="text-gray-300 text-base">.com</span>
        </h1>
        <br />
        <Link to="/received" className="button-sm inline-block">
          {"<"} Show all Received Gift Cards
        </Link>
      </div>
      <div className="content max-w-4xl mb-4 min-h-72">
        {isLoading ? (
          "Loading gift card " + giftId + "..."
        ) : isError ? (
          "Error: " + error
        ) : (
          <GiftCard gift={data!} refundable={[]} />
        )}
        <CopyFormattedContent gift={data!} />
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
            for instructions
          </div>
        )}
        <div>
          {isAuthenticated ? (
            isEmailVerified ? (
              isForMe ? (
                <div>
                  "The amount has been added to your account. 🎉"
                  <br />
                  <br />
                  <Link
                    to="/account"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-200 mb-4"
                  >
                    Go to Your Accout
                  </Link>
                </div>
              ) : (
                <div>
                  The gift card is assigned to another email address.
                  <br />
                  <br />
                  <button
                    onClick={changeAccount}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition duration-200 mb-4"
                  >
                    Change Account
                  </button>
                </div>
              )
            ) : (
              <div>
                Your email address has not been verified
                <br />
                <br />
                <form action="#" onSubmit={formVerifyEmail}>
                  <button type="submit" className="w-2/3">
                    Verify Email Address
                  </button>
                  <button
                    onClick={changeAccount}
                    className="w-1/3 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition duration-200 mb-4"
                  >
                    Change Account
                  </button>
                </form>
              </div>
            )
          ) : (
            <div>
              Sign in to redeem.
              <br />
              <br />
              <button
                onClick={login}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-200 mb-4"
              >
                Sign In with Google
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowGiftCard;
