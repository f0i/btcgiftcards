export type Theme = { name: ThemeKey; cover: string };
export type ThemeKey =
  | "xmas"
  | "xmasThankYou"
  | "btcFuture"
  | "btcPlan"
  | "birthday";
const themes: { [key: string]: Theme } = {
  xmas: { name: "xmas", cover: "/themes/xmas-gift.jpg" },
  xmasThankYou: {
    name: "xmasThankYou",
    cover: "/themes/xmas-thankyou.jpg",
  },
  btcFuture: { name: "btcFuture", cover: "/themes/btc-future.jpeg" },
  btcPlan: { name: "btcPlan", cover: "/themes/btc-plan.jpg" },
  birthday: { name: "birthday", cover: "/themes/birthday.jpeg" },
};

export const getTheme = (name: string): Theme => {
  if (name === "") name = "xmas"; // default
  const keys = Object.keys(themes);
  const key = name in themes ? name : keys[djb2(name) % keys.length];
  return themes[key];
};

function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0; // Ensure non-negative integer
}

export function preloadImages() {
  Object.values(themes).forEach((theme: Theme) => {
    const img = new Image();
    img.src = theme.cover;
  });
}
