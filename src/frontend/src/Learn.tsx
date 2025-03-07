import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./components/ui/button";
import { Info, CheckCircle, Clock, DollarSign } from "lucide-react";
import CkBTCPage from "./learn/CkBTCPage";
import BitcoinPage from "./learn/BitcoinPage";
import TopNav from "./components/TopNav";
import { TinyFooter } from "./Footer";
import DepositCkBTCPage from "./learn/DepositPage";
import InternetComputerPage from "./learn/InternetComputerPage";
import Create from "./Create";
import CreateGiftCardPage from "./learn/CreateGiftCardPage";
import WithdrawPage from "./learn/WithdrawPage";

function Learn() {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  let { topic } = useParams();
  return (
    <>
      <TopNav tab={"learn"} />
      <div className="main grow">
        {topic === "bitcoin" ? (
          <BitcoinPage />
        ) : topic === "ckbtc" ? (
          <CkBTCPage />
        ) : topic === "icp" ? (
          <InternetComputerPage />
        ) : topic === "deposit" ? (
          <DepositCkBTCPage />
        ) : topic === "create" ? (
          <CreateGiftCardPage />
        ) : topic === "withdraw" ? (
          <WithdrawPage />
        ) : (
          <BitcoinPage />
        )}
      </div>
      <TinyFooter />
    </>
  );
}

function replacer(key: any, value: any) {
  if (typeof value === "bigint") {
    return `${value}n`; // Append 'n' to indicate a BigInt
  }
  return value;
}

export default Learn;
