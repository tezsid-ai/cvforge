"use client";

import type { RecommendedAddition } from "@/types/analysis";

type RecommendedAdditionsListProps = {
  additions?: RecommendedAddition[];
};

export default function RecommendedAdditionsList({
  additions = [],
}: RecommendedAdditionsListProps): React.JSX.Element | null {
  if (!additions || additions.length === 0) return null;

  return (
    <section className="animate-fade-in-up space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
        Recommended High-Impact Additions
      </h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {additions.map((item, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-xl border border-violet-500/10 bg-violet-950/5 p-5 backdrop-blur-xs hover:border-violet-500/20 transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-400 border border-violet-500/20">
                  {item.type}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold text-white leading-snug">
                {item.suggestion}
              </p>
            </div>
            <div className="mt-4 border-t border-violet-500/10 pt-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Why it matters:
              </span>
              <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
                {item.reason}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
