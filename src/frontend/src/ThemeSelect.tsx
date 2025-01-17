import { useState } from "react";
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

  const border = isActive
    ? "border-green-600 hover:border-green-800 "
    : "border-white hover:border-gray-300";

  return (
    <img
      src={theme.cover}
      className={
        "max-w-48 object-cover rounded-lg border-4 cursor-pointer aspect-video " +
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
      <div className="flex flex-row overflow-x-auto">
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
        readOnly={true}
        className="w-full"
      />
    </>
  );
};
