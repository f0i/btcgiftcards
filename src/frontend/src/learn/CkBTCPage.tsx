import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, CheckCircle, Clock, DollarSign, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CkBTCPage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <Card className="p-6 text-center">
        <CardContent className="flex flex-col items-center gap-4">
          <img
            src="/external/ckbtc.svg"
            alt="ckBTC Logo"
            className="w-16 h-16"
          />
          <h1 className="text-3xl font-bold">What is ckBTC?</h1>
          <p className="text-gray-600 max-w-2xl">
            ckBTC is a Bitcoin-backed token running on the Internet Computer
            (IC), offering fast, low-cost transactions while remaining fully
            backed 1:1 by Bitcoin. It enables seamless integration with the IC
            ecosystem, providing a trustless, decentralized solution for Bitcoin
            payments and smart contracts.
          </p>
          <a
            href="https://internetcomputer.org/ckbtc"
            className="text-blue-600 hover:underline"
          >
            Learn more on the official ckBTC page
          </a>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Clock className="w-10 h-10 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">Fast Transactions</h3>
            <p className="text-gray-600">
              No long confirmation times. Transactions settle quickly on the IC.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <DollarSign className="w-10 h-10 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">Affordable Fees</h3>
            <p className="text-gray-600">
              Transaction costs are as low as 1 cent, making ckBTC a
              cost-effective option.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <CheckCircle className="w-10 h-10 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">1:1 Bitcoin Backing</h3>
            <p className="text-gray-600">
              Each ckBTC token is backed by actual Bitcoin, ensuring complete
              security and transparency.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Learn More Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Explore More About ckBTC
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <ArrowRight className="w-5 h-5 text-primary mr-2" />
              <a
                href="https://internetcomputer.org/bitcoin-integration/faq#how-do-i-convert-btc-to-ckbtc-using-the-nns-wallet"
                className="text-blue-600 hover:underline"
              >
                Acquiring ckBTC: Convert Bitcoin in the NNS
              </a>
            </li>
            <li className="flex items-center">
              <ArrowRight className="w-5 h-5 text-primary mr-2" />
              <a
                href="/learn/deposit"
                className="text-blue-600 hover:underline"
              >
                Transferring ckBTC into Bitcoin Gift Cards
              </a>
            </li>
            <li className="flex items-center">
              <ArrowRight className="w-5 h-5 text-primary mr-2" />
              <a
                href="/learn/withdraw"
                className="text-blue-600 hover:underline"
              >
                Sending ckBTC back to the NNS
              </a>
            </li>
            <li className="flex items-center">
              <ArrowRight className="w-5 h-5 text-primary mr-2" />
              <a
                href="https://internetcomputer.org/bitcoin-integration/faq#how-do-i-convert-ckbtc-to-btc-using-the-nns-wallet"
                className="text-blue-600 hover:underline"
              >
                Converting ckBTC to Bitcoin inside the NNS
              </a>
            </li>
            <li className="flex items-center">
              <ArrowRight className="w-5 h-5 text-primary mr-2" />
              <a
                href="https://internetcomputer.org/ecosystem/?tag=Bitcoin"
                className="text-blue-600 hover:underline"
              >
                Using ckBTC on apps, DEXs, and other crypto platforms
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => navigate("/learn/bitcoin")}>
          ← Learn About Bitcoin
        </Button>
        <Button variant="outline" onClick={() => navigate("/learn/icp")}>
          Learn about Internet Computer <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
