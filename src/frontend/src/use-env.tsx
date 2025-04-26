export const useEnv = () => {
  const isDemo = process.env.DFX_NETWORK === "demo";
  const isLocal = process.env.DFX_NETWORK === "local";

  const satPerUSD = 1070.0;

  return {
    isDemo,
    isLocal,
    satPerUSD,
  };
};
