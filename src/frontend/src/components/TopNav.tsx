import { Link } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../use-auth-client";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEnv } from "@/use-env";

export type Tab =
  | "created"
  | "new"
  | "received"
  | "account"
  | "withdraw"
  | "learn";

const TopNav = ({ tab }: { tab: Tab }) => {
  const { login, logout, isAuthenticated } = useAuth();
  const { isDemo } = useEnv();

  const NavItems = () => (
    <>
      <Link
        to="/account"
        className={`px-4 py-2 rounded-md transition-colors ${
          tab === "account"
            ? "bg-gray-100 text-black"
            : "text-gray-700 hover:bg-gray-100 hover:text-black"
        }`}
      >
        Account
      </Link>
      <Link
        to="/create"
        className={`px-4 py-2 rounded-md transition-colors ${
          tab === "new"
            ? "bg-gray-100 text-black"
            : "text-gray-700 hover:bg-gray-100 hover:text-black"
        }`}
      >
        Create
      </Link>
      <Link
        to="/received"
        className={`px-4 py-2 rounded-md transition-colors ${
          tab === "received"
            ? "bg-gray-100 text-black"
            : "text-gray-700 hover:bg-gray-100 hover:text-black"
        }`}
      >
        Received
      </Link>
      <Link
        to="/created"
        className={`px-4 py-2 rounded-md transition-colors ${
          tab === "created"
            ? "bg-gray-100 text-black"
            : "text-gray-700 hover:bg-gray-100 hover:text-black"
        }`}
      >
        Created
      </Link>
      <Link
        to="/learn"
        className={`px-4 py-2 rounded-md transition-colors ${
          tab === "learn"
            ? "bg-gray-100 text-black"
            : "text-gray-700 hover:bg-gray-100 hover:text-black"
        }`}
      >
        Learn
      </Link>
      <div className="grow" />
      {isAuthenticated ? (
        <Link to="/" onClick={logout} className="button-hover-danger">
          Sign out
        </Link>
      ) : (
        <Link to="/" onClick={() => login(false)} className="button">
          Sign in
        </Link>
      )}
    </>
  );

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

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:space-x-4 md:items-center">
          <NavItems />
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger className="md:hidden p-2 flex items-center hover:bg-gray-100 rounded-md">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[240px] sm:w-[280px] flex flex-col gap-4 pt-10"
          >
            <NavItems />
          </SheetContent>
        </Sheet>

        <div className="grow font-bold text-red-600 text-center flex items-center justify-center">
          {isDemo && (
            <>
              <span className="md:hidden">Demo mode - No real Bitcoin</span>
              <span className="hidden md:inline">
                !!! Demo mode: For testing only. No real Bitcoin involved. !!!
              </span>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default TopNav;
