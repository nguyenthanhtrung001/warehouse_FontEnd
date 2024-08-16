import { useState } from "react";

interface SwitcherFourProps {
  onChange: (enabled: boolean) => void;
}

const SwitcherFour: React.FC<SwitcherFourProps> = ({ onChange }) => {
  const [enabled, setEnabled] = useState<boolean>(false);

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    onChange(newEnabled); // Gọi callback để truyền giá trị lên component cha
  };

  return (
    <div>
      <label
        htmlFor="toggle4"
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="toggle4"
            className="sr-only"
            onChange={handleToggle}
          />
          <div className="block h-8 w-14 rounded-full bg-black"></div>
          <div
            className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
              enabled && "!right-1 !translate-x-full"
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default SwitcherFour;
