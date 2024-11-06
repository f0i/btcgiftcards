import { useAuth, AuthProvider } from "./use-auth-client";
import LoggedOut from "./LoggedOut";
import LoggedIn from "./LoggedIn";

function App() {
  const { isAuthenticated, identity } = useAuth();

  return (
    <main>
      <h1>BTC Gift Cards</h1>
      <br />
      <br />
      {isAuthenticated ? <LoggedIn /> : <LoggedOut />}
    </main>
  );
}

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
