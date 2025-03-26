import { Link } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../use-auth-client";

export type Tab =
  | "created"
  | "new"
  | "received"
  | "account"
  | "withdraw"
  | "learn";

const TopNav = ({ tab }: { tab: Tab }) => {
  const { login, logout, isAuthenticated } = useAuth();

  const isTestnet = process.env.DFX_NETWORK === "demo" || true;
  return (
    <div className="w-full flex felx-row space-x-8 p-1 shadow-md sticky top-0 z-50 whitespace-nowrap bg-white">
      <nav className="flex w-max-center space-x-4 flex-wrap overflow-x-hidden p-1 text-gray-700">
        <Link
          to="/"
          className="logo flex flex-row gap-4 text-gray-600 font-bold leading-none items-center text-orange-700"
        >
          <Logo />
          <div className="hidden">
            Bitcoin
            <br />
            Giftcards
          </div>
        </Link>
        <Link
          to="/account"
          className={tab === "account" ? "active" : "inactive"}
        >
          Account
        </Link>
        <Link to="/create" className={tab === "new" ? "active" : "inactive"}>
          Create
        </Link>
        <Link
          to="/received"
          className={tab === "received" ? "active" : "inactive"}
        >
          Received
        </Link>
        <Link
          to="/created"
          className={tab === "created" ? "active" : "inactive"}
        >
          Created
        </Link>
        <Link to="/learn" className={tab === "learn" ? "active" : "inactive"}>
          Learn
        </Link>
        <a className="grow font-bold text-xl text-red-600 text-center">
          {isTestnet
            ? "!!! Demo mode: For testing only. No real Bitcoin involved. !!!"
            : null}
        </a>
        {isAuthenticated ? (
          <Link to="/" onClick={logout} className="button-hover-danger">
            Sign out
          </Link>
        ) : (
          <Link to="/" onClick={() => login(false)} className="button">
            Sign in
          </Link>
        )}
      </nav>
    </div>
  );
};

export default TopNav;
