"use client";

import { useState } from "react";
import { EXPERIENCE_LEVELS } from "@/lib/constants";

type ExperienceSliderProps = {
  onSubmit: (level: string) => void;
};

export default function ExperienceSlider({
  onSubmit,
}: ExperienceSliderProps): React.JSX.Element {
  const [index, setIndex] = useState(0);

  return (
    <div className="space-y-4">
      <input
        type="range"
        min={0}
        max={EXPERIENCE_LEVELS.length - 1}
        value={index}
        onChange={(e) => setIndex(Number(e.target.value))}
        className="w-full accent-violet-500"
      />
      <div className="flex justify-between text-xs text-zinc-400">
        {EXPERIENCE_LEVELS.map((lvl) => (
          <span key={lvl.value} className={lvl.value === index ? "font-bold text-violet-300" : ""}>
            {lvl.label}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onSubmit(EXPERIENCE_LEVELS[index].label)}
        className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
      >
        Confirm: {EXPERIENCE_LEVELS[index].label}
      </button>
    </div>
  );
}
