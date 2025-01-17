import { useAuth } from "./use-auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import TopNav, { Tab } from "./components/TopNav";
import Footer from "./Footer";
import Showcase from "./Showcase";

function Learn({ tab }: { tab: Tab }) {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  return (
    <>
      <TopNav tab={tab} />
      <div className="main grow">
        <div className="content max-w-4xl mb-4">
          <section className="mt-16">
            <h3>What to do with ckBTC?</h3>
            <Showcase />
          </section>
        </div>
      </div>
      <Footer />
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
