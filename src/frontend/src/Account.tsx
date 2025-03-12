import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BackendActor,
  LedgerActor,
  MinterActor,
  useAuth,
} from "./use-auth-client";
import { GiftInfo } from "../../declarations/backend/backend.did";
import { ckbtc_ledger } from "../../declarations/ckbtc_ledger";
import { confirmDialog, CopyButton } from "./CopyButton";
import {
  decodeAccount,
  encodeAccount,
  formatCurrency,
  shortenErr,
} from "./utils";
import { queries } from "./queryKeys";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PageLoading } from "./PageLoading";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { useState } from "react";
import { Input } from "./components/ui/input";

function Account() {
  const { backendActor, minterActor, principal } = useAuth();
  const queryClient = useQueryClient();

  const { isLoading, isError, data, error, failureCount } = useQuery(
    queries.giftcards(queryClient, backendActor, principal),
  );

  return (
    <div className="w-max-center">
      <PageLoading
        isLoading={isLoading}
        isError={isError}
        error={error}
        failureCount={failureCount}
      />
      {data && backendActor && minterActor && "ok" in data && (
        <UserInfo
          info={data.ok}
          ledger={ckbtc_ledger}
          minter={minterActor}
          backend={backendActor}
        />
      )}
    </div>
  );
}

export default Account;

function UserInfo({
  info,
  ledger,
  backend,
}: {
  info: GiftInfo;
  ledger: LedgerActor;
  minter: MinterActor;
  backend: BackendActor;
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isLoading, isError, data, error } = useQuery(
    queries.balance(ledger, info.account),
  );

  // User info
  const email = info.email;

  // Deposit info
  const depositAddress = encodeAccount(info.account);
  const balance = isLoading
    ? "loading..."
    : isError
      ? "Error: " + error
      : data?.toString() + " ckSat";

  // Withdrawl info
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const getMaxAmount = (): bigint => {
    if (data && data > 10n) {
      return data - 10n;
    }
    return 0n;
  };

  const handleMaxAmount = () => {
    if (data) setAmount(getMaxAmount().toString());
  };

  const handleWithdraw = async (event: any) => {
    event?.preventDefault();
    try {
      const withdrawAmount = BigInt(amount);
      const toAccount = decodeAccount(address);
      if (withdrawAmount < 1n) throw "Amount too small";
      if (data && withdrawAmount > getMaxAmount())
        throw "Amount is larger than available funds";
      await confirmDialog({
        msg: `Withdraw ${withdrawAmount.toString()} ckSat from your account to:`,
        sub: encodeAccount(toAccount),
      });

      const res = await backend.withdraw(toAccount, withdrawAmount);
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
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Your email address:{" "}
            <span className="font-mono text-gray-800">{email}</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About ckBTC</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            You need ckBTC to create new gift cards. You can either deposit
            ckBTC into your personal account shown below or connect a wallet
            with ckBTC in it.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate("/learn/deposit")}
            className="mt-2"
          >
            Learn how to get ckBTC.
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deposit ckBTC</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">
              ckBTC deposit account:
            </p>
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
              <span className="font-mono text-sm text-gray-800 break-all">
                {depositAddress}
              </span>
              <CopyButton label="copy" textToCopy={depositAddress} />
            </div>
            <p className="text-sm text-gray-600">Account balance:</p>
            <p className="text-lg">{balance}</p>
            <p className="text-sm font-medium text-gray-600 text-center">
              containing
            </p>
            <div className="font-bold text-orange-600 text-2xl text-center">
              {formatCurrency(data ?? 0n, 100000000.0, 0)} Bitcoin
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Withdraw ckBTC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Available Balance</p>
            <p className="text-lg">{getMaxAmount().toString()} ckBTC</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Withdrawal Address</p>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter the ckBTC destination address"
              className="w-full text-sm"
            />
          </div>
          <div>
            <p className="text-sm text-gray-600">Amount to Withdraw</p>
            <div className="flex items-center gap-2">
              <div className="w-full relative">
                <span className="absolute md:text-sm right-2 sm:right-10 top-2">
                  ckSat
                </span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full"
                  min="0"
                />
              </div>
              <Button onClick={handleMaxAmount} variant="outline">
                Max
              </Button>
            </div>
          </div>
          <Button className="w-full" onClick={handleWithdraw}>
            Withdraw
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
