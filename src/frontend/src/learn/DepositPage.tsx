import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle, Send, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DepositCkBTCPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <Card className="p-6 text-center">
        <CardContent className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold">How to Deposit ckBTC</h1>
          <p className="text-gray-600 max-w-2xl">
            To start creating Bitcoin Gift Cards, you first need to deposit
            ckBTC into your account. Follow these steps to transfer ckBTC from
            the NNS to your Bitcoin Gift Cards balance.
          </p>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 flex gap-4 items-start">
            <Wallet className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">
                Step 1: Find Your Deposit Address
              </h3>
              <p className="text-gray-600">
                Navigate to the Account Page in Bitcoin Gift Cards. There,
                you’ll find your unique ckBTC deposit address.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex gap-4 items-start">
            <Send className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">
                Step 2: Send ckBTC from the NNS
              </h3>
              <p className="text-gray-600">
                Visit the{" "}
                <a
                  href="https://nns.ic0.app/"
                  className="text-blue-500 underline"
                >
                  NNS dApp
                </a>{" "}
                and log into your account. Navigate to your ckBTC balance, then
                transfer ckBTC to the deposit address you found in Step 1.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex gap-4 items-start">
            <CheckCircle className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">
                Step 3: Check Your Balance
              </h3>
              <p className="text-gray-600">
                After a few seconds, your deposited ckBTC should appear in your
                Bitcoin Gift Cards account balance. You can now start creating
                gift cards!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/learn/icp")}>
          <ArrowLeft /> Learn about Internet Computer
        </Button>
        <Button
          className="ml-auto"
          variant="outline"
          onClick={() => navigate("/learn/create")}
        >
          How to create a Bitcoin Gift Card <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
