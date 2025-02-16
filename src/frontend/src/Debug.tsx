import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./use-auth-client";
import { queries } from "./queryKeys";
import { stringify } from "./utils";

function Debug() {
  const { backendActor, minterActor, principal } = useAuth();
  const queryClient = useQueryClient();

  const { isLoading, isError, data, error } = useQuery(
    queries.giftcards(queryClient, backendActor, principal),
  );
  return (
    <div className="text-gray-200 text-pre">{stringify(data ?? error)}</div>
  );
}

export default Debug;
