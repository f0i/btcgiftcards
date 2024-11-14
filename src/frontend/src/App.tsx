import { useAuth, AuthProvider } from "./use-auth-client";
import LoggedOut from "./LoggedOut";
import LoggedIn from "./LoggedIn";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <LoggedIn /> : <LoggedOut />}
        />
        <Route path="/show/:id" element={<div>TODO</div>} />
        <Route path="/colors" element={<ColorTest />} />
        <Route path="/signin" element={<LoggedOut />} />
      </Routes>
    </Router>
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
