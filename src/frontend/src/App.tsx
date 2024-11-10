import { useAuth, AuthProvider } from "./use-auth-client";
import LoggedOut from "./LoggedOut";
import LoggedIn from "./LoggedIn";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <main>
      <h1>BTC Gift Cards</h1>
      <br />
      <br />
      {isAuthenticated ? <LoggedIn /> : <LoggedOut />}
    </main>
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
