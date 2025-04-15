export const useEnv = () => {
  const isDemo = process.env.DFX_NETWORK === "demo";
  const isLocal = process.env.DFX_NETWORK === "local";

  const satPerUSD = 1200.0;

  return {
    isDemo,
    isLocal,
    satPerUSD,
  };
};
