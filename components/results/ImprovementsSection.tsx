"use client";

import type { ImprovementItem } from "@/types/analysis";
import ImprovementCard from "./ImprovementCard";

type ImprovementsSectionProps = {
  improvements: ImprovementItem[];
  selectedIndices: Set<number>;
  onToggleIndex: (index: number) => void;
};

export default function ImprovementsSection({
  improvements,
  selectedIndices,
  onToggleIndex,
}: ImprovementsSectionProps): React.JSX.Element {
  return (
    <section className="animate-fade-in-up rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
      <h2 className="text-lg font-semibold text-white">Resume Improvements</h2>
      {improvements.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-300">
          Your resume is already strong
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {improvements.map((item, i) => (
            <ImprovementCard
              key={`${item.original}-${i}`}
              item={item}
              index={i}
              selected={selectedIndices.has(i)}
              onToggle={() => onToggleIndex(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
