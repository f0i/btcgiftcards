export type Theme = { name: ThemeKey; cover: string };
export type ThemeKey =
  | "xmas"
  | "xmasThankYou"
  | "btcFuture"
  | "btcPlan"
  | "birthday"
  | "valentine"
  | "wedding"
  | "easter";
const themes: { [key: string]: Theme } = {
  xmas: { name: "xmas", cover: "/themes/xmas-gift.jpg" },
  xmasThankYou: {
    name: "xmasThankYou",
    cover: "/themes/xmas-thankyou.jpg",
  },
  btcFuture: { name: "btcFuture", cover: "/themes/btc-future.jpeg" },
  btcPlan: { name: "btcPlan", cover: "/themes/btc-plan.jpg" },
  birthday: { name: "birthday", cover: "/email/birthday.jpeg" },
  valentine: { name: "valentine", cover: "/email/valentine.jpeg" },
  wedding: { name: "wedding", cover: "/email/wedding.jpeg" },
  easter: { name: "easter", cover: "/email/easter.jpeg" },
};

export const getTheme = (name: ThemeKey | string): Theme => {
  if (name === "") name = "valentine"; // default theme
  const keys = Object.keys(themes);
  const key = name in themes ? name : keys[djb2(name) % keys.length];
  return themes[key];
};

export function preloadImages() {
  Object.values(themes).forEach((theme: Theme) => {
    const img = new Image();
    img.src = theme.cover;
  });
}

function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0; // Ensure non-negative integer
}
