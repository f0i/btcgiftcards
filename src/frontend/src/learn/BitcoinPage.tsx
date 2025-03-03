import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Globe,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BitcoinPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <Card className="p-6 text-center">
        <CardContent className="flex flex-col items-center gap-4">
          <img
            src="/external/bitcoin.svg"
            alt="Bitcoin Logo"
            className="w-16 h-16"
          />
          <h1 className="text-3xl font-bold">What is Bitcoin?</h1>
          <p className="text-gray-600 max-w-2xl">
            Bitcoin is a decentralized digital currency that allows peer-to-peer
            transactions without the need for intermediaries like banks. It
            operates on a distributed ledger called the blockchain, ensuring
            transparency, security, and immutability. Bitcoin is often referred
            to as "digital gold" due to its limited supply and store-of-value
            properties.
          </p>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Globe className="w-10 h-10 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">Decentralized</h3>
            <p className="text-gray-600">
              No central authority controls Bitcoin, making it resistant to
              censorship.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <DollarSign className="w-10 h-10 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">Limited Supply</h3>
            <p className="text-gray-600">
              Only 21 million bitcoins will ever exist, making it scarce and
              valuable.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <CheckCircle className="w-10 h-10 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">Secure & Transparent</h3>
            <p className="text-gray-600">
              Bitcoin transactions are verified by a global network of nodes and
              recorded on the blockchain.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Learn More Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Learn More About Bitcoin
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <ArrowRight className="w-5 h-5 text-primary mr-2" />
              <a
                href="https://bitcoin.org"
                className="text-blue-600 hover:underline"
              >
                Official Bitcoin Website
              </a>
            </li>
            <li className="flex items-center">
              <ArrowRight className="w-5 h-5 text-primary mr-2" />
              <a
                href="https://bitcoin.org/en/getting-started"
                className="text-blue-600 hover:underline"
              >
                Get started with Bitcoin
              </a>
            </li>
            <li className="flex items-center">
              <ArrowRight className="w-5 h-5 text-primary mr-2" />
              <a
                href="https://bitcoin.org/en/bitcoin-paper"
                className="text-blue-600 hover:underline"
              >
                Read the Bitcoin Whitepaper
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <div />
        <Button variant="outline" onClick={() => navigate("/learn/ckbtc")}>
          Learn About ckBTC <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
