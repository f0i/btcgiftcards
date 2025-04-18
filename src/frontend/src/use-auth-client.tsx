import { AuthClient } from "@dfinity/auth-client";
import { createContext, useContext, useEffect, useState } from "react";
import { canisterId, createActor, backend } from "../../declarations/backend";
import { Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import {
  ckbtc_minter,
  createActor as createMinterActor,
  canisterId as canisterIdMinter,
} from "../../declarations/ckbtc_minter";
import {
  ckbtc_ledger,
  createActor as createLedgerActor,
  canisterId as canisterIdLedger,
} from "../../declarations/ckbtc_ledger";
import { useEnv } from "./use-env";

export type BackendActor = typeof backend;
export type MinterActor = typeof ckbtc_minter;
export type LedgerActor = typeof ckbtc_ledger;
const AuthContext = createContext({} as AuthProps);

export const getIdentityProvider = () => {
  const { isLocal } = useEnv();
  if (isLocal) {
    const ii = process.env.CANISTER_ID_INTERNET_IDENTITY;
    return "http://" + ii + ".localhost:4943/";
  }
  return "https://login.f0i.de";
};

export const defaultOptions = {
  /**
   *  @type {import("@dfinity/auth-client").AuthClientCreateOptions}
   */
  createOptions: {
    idleOptions: {
      // Set to true if you do not want idle functionality
      disableIdle: true,
    },
  },
  /**
   * @type {import("@dfinity/auth-client").AuthClientLoginOptions}
   */
  loginOptions: {
    identityProvider: getIdentityProvider(),
  },
};

type AuthProps = {
  isAuthenticated: boolean;
  login: (force: boolean) => Promise<unknown>;
  logout: () => Promise<void>;
  authClient?: AuthClient;
  identity?: Identity;
  principal?: Principal;
  backendActor?: BackendActor;
  minterActor?: MinterActor;
};
/**
 *
 * @param options - Options for the AuthClient
 * @param {AuthClientCreateOptions} options.createOptions - Options for the AuthClient.create() method
 * @param {AuthClientLoginOptions} options.loginOptions - Options for the AuthClient.login() method
 * @returns
 */
export const useAuthClient = (options = defaultOptions): AuthProps => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState<AuthClient | undefined>(
    undefined,
  );
  const [identity, setIdentity] = useState<Identity | undefined>(undefined);
  const [principal, setPrincipal] = useState<Principal | undefined>(undefined);
  const [backendActor, setBackendActor] = useState<BackendActor | undefined>(
    undefined,
  );
  const [minterActor, setMinterActor] = useState<MinterActor | undefined>(
    undefined,
  );

  useEffect(() => {
    // Initialize AuthClient
    AuthClient.create(options.createOptions).then(async (client) => {
      updateClient(client);
    });
  }, []);

  const login = (force: boolean): Promise<unknown> => {
    if (!authClient) {
      console.error("authClient not set");
      return Promise.reject("authClient not set");
    }
    if (!force && isAuthenticated) {
      return Promise.resolve();
    }
    return new Promise((res, rej) => {
      authClient.login({
        ...options.loginOptions,
        onSuccess: () => {
          updateClient(authClient);
          res(authClient);
        },
        onError: rej,
      });
    });
  };

  async function updateClient(client: AuthClient) {
    const isAuthenticated = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated);

    const identity = client.getIdentity();
    setIdentity(identity);
    const principal = identity.getPrincipal();
    setPrincipal(principal);
    setAuthClient(client);

    const actor = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });
    setBackendActor(actor);

    const minterActor = createMinterActor(canisterIdMinter, {
      agentOptions: {
        identity,
      },
    });
    setMinterActor(minterActor);
  }

  async function logout() {
    if (!authClient) {
      console.error("authClient not set");
      return;
    }
    await authClient.logout();
    await updateClient(authClient);
  }

  return {
    isAuthenticated,
    login,
    logout,
    authClient,
    identity,
    principal,
    backendActor,
    minterActor,
  };
};

export const AuthProvider = ({ children }: { children: any }) => {
  const auth = useAuthClient();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext<AuthProps>(AuthContext);
};
