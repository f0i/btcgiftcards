export const PageLoading = ({
  isLoading,
  isError,
  error,
  failureCount,
}: {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  failureCount: number;
}) => {
  if (isLoading) {
    return (
      "Loading" + (failureCount > 0 ? " retry " + failureCount + "..." : "...")
    );
  }
  if (isError) {
    return "Error: " + error;
  }
  return null;
};
