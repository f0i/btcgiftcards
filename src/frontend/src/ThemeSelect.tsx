import { useRef, useState } from "react";
import { getTheme, ThemeKey } from "./cardThemes";

export const ThemeButton = ({
  design,
  active,
  setActive,
}: {
  design: ThemeKey;
  active?: string;
  setActive: (key: ThemeKey) => void;
}) => {
  const theme = getTheme(design);
  const isActive = getTheme(active ?? "").name === theme.name;
  console.log("active: ", active);

  const border = isActive
    ? "border-green-600 hover:border-green-800 "
    : "border-white hover:border-gray-300";

  return (
    <img
      src={theme.cover}
      className={
        "w-1/4 max-w-1/4 max-h-[5em] object-cover rounded-lg max-h-[25em] border-4 cursor-pointer " +
        border
      }
      onClick={() => setActive(theme.name)}
    />
  );
};

export const ThemeSelect = ({ id }: { id: string }) => {
  const [active, setActive] = useState<ThemeKey>(getTheme("").name);

  return (
    <>
      <div className="flex flex-row">
        <ThemeButton setActive={setActive} design="xmas" active={active} />
        <ThemeButton setActive={setActive} design="btcFuture" active={active} />
        <ThemeButton setActive={setActive} design="btcPlan" active={active} />
        <ThemeButton setActive={setActive} design="birthday" active={active} />
        <ThemeButton
          setActive={setActive}
          design="xmasThankYou"
          active={active}
        />
      </div>
      <input
        value={active}
        id={id}
        alt="Design"
        type="text"
        hidden={true}
        className="w-full"
      />
    </>
  );
};
