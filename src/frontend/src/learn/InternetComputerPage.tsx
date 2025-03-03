import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Globe, Lock, Code, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InternetComputerPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <Card className="p-6 text-center">
        <CardContent className="flex flex-col items-center gap-4">
          <img
            src="/external/icp.svg"
            alt="Internet Computer Logo"
            className="w-16 h-16"
          />
          <h1 className="text-3xl font-bold">What is the Internet Computer?</h1>
          <p className="text-gray-600 max-w-2xl">
            The Internet Computer (IC) is a decentralized blockchain network
            that enables smart contracts to run at web speed, offering a
            scalable and tamper-proof environment for applications. Unlike
            traditional blockchains, the IC allows for fully on-chain
            applications without relying on centralized cloud services.
          </p>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Globe className="w-10 h-10 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">
              Decentralized Hosting
            </h3>
            <p className="text-gray-600">
              Run web applications directly on the blockchain, removing reliance
              on cloud providers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Lock className="w-10 h-10 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">Secure & Scalable</h3>
            <p className="text-gray-600">
              Designed to support mass adoption with secure, fast, and
              cost-efficient transactions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Code className="w-10 h-10 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">
              Innovative Smart Contracts
            </h3>
            <p className="text-gray-600">
              Supports fully on-chain dApps and services using WebAssembly-based
              smart contracts.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Learn More Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Learn More About the Internet Computer
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <ArrowRight className="w-5 h-5 text-primary mr-2" />
              <a
                href="https://internetcomputer.org/"
                className="text-blue-600 hover:underline"
              >
                Official Internet Computer Website
              </a>
            </li>
            <li className="flex items-center">
              <ArrowRight className="w-5 h-5 text-primary mr-2" />
              <a
                href="https://dashboard.internetcomputer.org/"
                className="text-blue-600 hover:underline"
              >
                Internet Computer Dashboard
              </a>
            </li>
            <li className="flex items-center">
              <ArrowRight className="w-5 h-5 text-primary mr-2" />
              <a
                href="https://wiki.internetcomputer.org/wiki/Main_Page"
                className="text-blue-600 hover:underline"
              >
                Internet Computer Wiki
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/learn/ckbtc")}>
          <ArrowLeft /> Learn about ckBTC
        </Button>
        <Button variant="outline" onClick={() => navigate("/learn/deposit")}>
          How to deposit ckBTC <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
