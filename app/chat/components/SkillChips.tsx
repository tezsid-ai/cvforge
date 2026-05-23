"use client";

import { useState } from "react";
import { TECH_KEYWORDS } from "@/lib/constants";

type SkillChipsProps = {
  onSubmit: (skills: string[]) => void;
};

export default function SkillChips({
  onSubmit,
}: SkillChipsProps): React.JSX.Element {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [custom, setCustom] = useState("");

  const toggle = (skill: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(skill) ? next.delete(skill) : next.add(skill);
      return next;
    });
  };

  const addCustom = () => {
    const val = custom.trim();
    if (val) {
      setSelected((prev) => new Set(prev).add(val));
      setCustom("");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {TECH_KEYWORDS.map((skill) => (
          <button
            key={skill}
            type="button"
            onClick={() => toggle(skill)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              selected.has(skill)
                ? "border-violet-500 bg-violet-600/30 text-violet-200"
                : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-500"
            }`}
          >
            {skill}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addCustom())
          }
          placeholder="Add custom skill..."
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-500"
        />
        <button
          type="button"
          onClick={addCustom}
          className="rounded-lg bg-zinc-700 px-3 py-2 text-xs text-white hover:bg-zinc-600"
        >
          Add
        </button>
      </div>
      <button
        type="button"
        disabled={selected.size === 0}
        onClick={() => onSubmit(Array.from(selected))}
        className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-40"
      >
        Confirm Skills ({selected.size})
      </button>
    </div>
  );
}
