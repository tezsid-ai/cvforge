"use client";

import { useState } from "react";
import { SOFT_SKILLS } from "@/lib/constants";

type SoftSkillBadgesProps = {
  onSubmit: (skills: string[]) => void;
};

export default function SoftSkillBadges({
  onSubmit,
}: SoftSkillBadgesProps): React.JSX.Element {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (skill: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(skill) ? next.delete(skill) : next.add(skill);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {SOFT_SKILLS.map((skill) => (
          <button
            key={skill}
            type="button"
            onClick={() => toggle(skill)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              selected.has(skill)
                ? "border-indigo-500 bg-indigo-600/30 text-indigo-200"
                : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-500"
            }`}
          >
            {skill}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={selected.size === 0}
        onClick={() => onSubmit(Array.from(selected))}
        className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-40"
      >
        Confirm Soft Skills ({selected.size})
      </button>
    </div>
  );
}
