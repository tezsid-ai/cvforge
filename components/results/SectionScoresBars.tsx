"use client";

import type { SectionScores } from "@/types/analysis";

type SectionScoresBarsProps = {
  scores?: SectionScores;
};

export default function SectionScoresBars({
  scores,
}: SectionScoresBarsProps): React.JSX.Element | null {
  if (!scores) return null;

  const sections = [
    {
      label: "Summary",
      value: scores.summary ?? 0,
      color: "from-blue-500 to-indigo-500",
    },
    {
      label: "Experience",
      value: scores.experience ?? 0,
      color: "from-violet-500 to-purple-500",
    },
    {
      label: "Skills",
      value: scores.skills ?? 0,
      color: "from-pink-500 to-rose-500",
    },
    {
      label: "Education",
      value: scores.education ?? 0,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <section className="animate-fade-in-up rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4">
        ATS Section Breakdown
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((sec) => (
          <div key={sec.label} className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-zinc-300">{sec.label}</span>
              <span className="text-zinc-100">{sec.value}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${sec.color} transition-all duration-1000`}
                style={{ width: `${sec.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
