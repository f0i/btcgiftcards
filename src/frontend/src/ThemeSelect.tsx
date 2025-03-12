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

export const ThemeSelect = ({
  id,
  onChange,
  initial,
}: {
  id: string;
  onChange?: (e: any) => void;
  initial?: ThemeKey;
}) => {
  const [active, setActive] = useState<ThemeKey>(getTheme(initial ?? "").name);
  console.log("ThemeSelect", initial);
  const setActiveChange = (theme: ThemeKey) => {
    setActive(theme);
    if (onChange) {
      onChange({ target: { id: id, value: theme } });
    }
  };

  return (
    <>
      <div className="flex flex-row overflow-x-auto">
        <ThemeButton
          setActive={setActiveChange}
          design="valentine"
          active={active}
        />
        <ThemeButton
          setActive={setActiveChange}
          design="easter"
          active={active}
        />
        <ThemeButton
          setActive={setActiveChange}
          design="wedding"
          active={active}
        />
        <ThemeButton
          setActive={setActiveChange}
          design="birthday"
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
