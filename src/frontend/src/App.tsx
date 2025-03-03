import { useAuth, AuthProvider } from "./use-auth-client";
import LoggedOut from "./LoggedOut";
import LoggedIn from "./LoggedIn";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShowGiftCard from "./ShowGiftCard";
import { useEffect } from "react";
import { preloadImages } from "./cardThemes";
import Landing from "./Landing";
import Learn from "./Learn";
import Debug from "./Debug";

function App() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    preloadImages();
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/create"
            element={isAuthenticated ? <LoggedIn tab="new" /> : <LoggedOut />}
          />
          <Route
            path="/created"
            element={
              isAuthenticated ? <LoggedIn tab="created" /> : <LoggedOut />
            }
          />
          <Route
            path="/received"
            element={
              isAuthenticated ? <LoggedIn tab="received" /> : <LoggedOut />
            }
          />
          <Route
            path="/account"
            element={
              isAuthenticated ? <LoggedIn tab="account" /> : <LoggedOut />
            }
          />
          <Route
            path="/withdraw"
            element={
              isAuthenticated ? <LoggedIn tab="withdraw" /> : <LoggedOut />
            }
          />
          <Route path="/show/:giftId" element={<ShowGiftCard />} />
          <Route path="/send/:giftId" element={<ShowGiftCard />} />
          <Route path="/colors" element={<ColorTest />} />
          <Route path="/signin" element={<LoggedOut />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:topic" element={<Learn />} />
          <Route path="/debug" element={<Debug />} />
        </Routes>
      </Router>
    </>
  );
}

export default () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  );
};

function ColorTest() {
  const colors = [
    {
      name: "Christmas Red",
      class: "bg-red-600",
    },
    {
      name: "Christmas Green",
      class: "bg-green-600",
    },
    {
      name: "Snow White",
      class: "bg-white",
    },
    {
      name: "Gold",
      class: "bg-yellow-400",
    },
    {
      name: "Holly Berry",
      class: "bg-red-500",
    },
    {
      name: "Mistletoe Green",
      class: "bg-teal-600",
    },
    {
      name: "Frosty Blue",
      class: "bg-blue-200",
    },
    {
      name: "Silver",
      class: "bg-gray-400",
    },
    {
      name: "Pine Tree Green",
      class: "bg-green-700",
    },
    {
      name: "Candy Cane Red",
      class: "bg-red-300",
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {colors.map((color) => (
        <div
          key={color.name}
          className={`${color.class} w-44 h-16 p-2 rounded-md`}
          title={color.name}
        >
          {color.class}
        </div>
      ))}
    </div>
  );
}
