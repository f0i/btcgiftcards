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
          element={
            <main>
              <h1>BTC Gift Cards</h1>
              {isAuthenticated ? <LoggedIn /> : <LoggedOut />}
            </main>
          }
        />
        <Route path="/show/:id" element={<div>TODO</div>} />
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
