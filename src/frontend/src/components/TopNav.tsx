import { Link } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../use-auth-client";
import { BsCaretDown } from "react-icons/bs";

export type Tab = "created" | "new" | "received" | "account" | "learn";

const TopNav = ({ tab }: { tab: Tab }) => {
  const { login, logout, isAuthenticated } = useAuth();
  return (
    <div className="w-full flex felx-row space-x-8 bg-white p-1 shadow-md sticky top-0 z-50 whitespace-nowrap">
      <nav className="flex w-full space-x-4 overflow-x-hidden p-1">
        <Link to="/" className="logo">
          <Logo />
        </Link>
        <Link
          to="/account"
          className={tab === "account" ? "active" : "inactive"}
        >
          Account
        </Link>
        <Link
          to="/create"
          className={
            "hidden sm:block " + (tab === "new" ? "active" : "inactive")
          }
        >
          Create
        </Link>
        <Link
          to="/received"
          className={
            "hidden sm:block " + (tab === "received" ? "active" : "inactive")
          }
        >
          Received
        </Link>
        <Link
          to="/created"
          className={
            "hidden md:block " + (tab === "created" ? "active" : "inactive")
          }
        >
          Created
        </Link>
        <Link to="/learn" className={tab === "learn" ? "active" : "inactive"}>
          Learn
        </Link>
        <div className="grow" />
        {isAuthenticated ? (
          <Link to="/" onClick={logout} className="button">
            Sign out
          </Link>
        ) : (
          <Link to="/" onClick={login} className="button">
            Sign in <BsCaretDown className="inline-block" />
          </Link>
        )}
      </nav>
    </div>
  );
};

export default TopNav;