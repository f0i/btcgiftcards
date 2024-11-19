import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { queryKeys } from "./queryKeys";
import { useAuth } from "./use-auth-client";
import { GiftCard } from "./GiftCard";

const ShowGiftCard = () => {
  const { giftId } = useParams();
  const { backendActor, logout, login, isAuthenticated, identity } = useAuth();

  const { isPaused, isLoading, isError, data, error } = useQuery({
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
  const info = useQuery({
    queryKey: ["giftcards", backendActor, isAuthenticated],
    queryFn: () => {
      if (identity && !identity.getPrincipal().isAnonymous()) {
        return backendActor?.listGiftcards();
      }
      return null;
    },
  });

  const formVerifyEmail = async (event: any) => {
    event.preventDefault();
    const email = "icidentify@gmail.com"; //TODO! set email address
    try {
      const res = await backendActor!.verifyEmail(email);
      console.log(res);
      if ("ok" in res) {
        window.alert("Verified " + res.ok);
        queryClient.invalidateQueries();
      } else {
        window.alert("Error: " + res.err);
      }
    } catch (e) {
      window.alert("Error: " + e);
    }
  };

  const isEmailVerified = !!info.data?.accountEmail?.[0];
  // TODO: auto verify email address
  const isForMe = info.data?.accountEmail?.[0] === data?.to;

  const changeAccount = async (e: any) => {
    try {
      e.preventDefault();
    } catch (e) {}
    await logout();
    await login();
  };

  return (
    <div className="main">
      <div className="content max-w-4xl mb-4 min-h-72">
        {isLoading ? (
          "Loading gift card " + giftId + "..."
        ) : isError ? (
          "Error: " + error
        ) : (
          <GiftCard gift={data!} showRefund={false} />
        )}
        <br />
        <div>
          {isAuthenticated ? (
            isEmailVerified ? (
              isForMe ? (
                "The amount has been added to your account. 🎉"
              ) : (
                <div>
                  The gift card is assigned to another email address.
                  <br />
                  <br />
                  <button
                    onClick={changeAccount}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition duration-200 mb-4"
                  >
                    Change account
                  </button>
                </div>
              )
            ) : (
              <div>
                Your eamil address has not been verified
                <br />
                <br />
                <form action="#" onSubmit={formVerifyEmail}>
                  <label htmlFor="gmail">Your gmail address: &nbsp;</label>
                  <input
                    id="gmail"
                    type="text"
                    value={data?.to}
                    disabled={true}
                  />
                  <button type="submit" className="w-2/3">
                    Verify Gmail Address
                  </button>
                  <button
                    onClick={changeAccount}
                    className="w-1/3 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition duration-200 mb-4"
                  >
                    Change account
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
