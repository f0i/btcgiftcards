import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Info,
  ClipboardList,
  Send,
  Eye,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WithdrawPage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <Card className="p-6 text-center">
        <CardContent className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold">Withdraw ckBTC to the NNS</h1>
          <p className="text-gray-600 max-w-2xl">
            You can withdraw your ckBTC from Bitcoin Gift Cards and send it back
            to the NNS. Follow these steps to complete the process.
          </p>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 flex gap-4 items-start">
            <Info className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">
                Step 1: Find Your NNS ckBTC Address
              </h3>
              <p className="text-gray-600">
                Log in to the{" "}
                <a
                  href="https://nns.ic0.app/"
                  className="text-blue-600 hover:underline"
                >
                  NNS
                </a>{" "}
                and navigate to your ckBTC account to find your deposit address.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex gap-4 items-start">
            <ClipboardList className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">
                Step 2: Initiate Withdrawal
              </h3>
              <p className="text-gray-600">
                Go to the Bitcoin Gift Cards account page, enter your NNS ckBTC
                address, and specify the amount you want to withdraw.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex gap-4 items-start">
            <Eye className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">
                Step 3: Review and Confirm
              </h3>
              <p className="text-gray-600">
                Double-check the withdrawal details, including the destination
                address and amount. Once verified, proceed to confirm the
                transaction.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex gap-4 items-start">
            <Send className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">
                Step 4: Complete the Withdrawal
              </h3>
              <p className="text-gray-600">
                Click the "Withdraw" button to send your ckBTC to the NNS. The
                transaction will be processed, and your ckBTC balance should
                update shortly in the NNS.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/learn/create")}>
          <ArrowLeft /> How to create a Bitcoin Gift Card
        </Button>
      </div>
    </div>
  );
}
