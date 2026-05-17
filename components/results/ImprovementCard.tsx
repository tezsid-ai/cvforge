"use client";

import type { ImprovementItem } from "@/types/analysis";

type ImprovementCardProps = {
  item: ImprovementItem;
  index: number;
  applied: boolean;
  onApply: () => void;
};

export default function ImprovementCard({
  item,
  index,
  applied,
  onApply,
}: ImprovementCardProps): React.JSX.Element {
  return (
    <article
      className={`animate-fade-in-up rounded-2xl border p-5 transition-all duration-300 ${
        applied
          ? "border-green-400/30 bg-green-500/5 opacity-70"
          : "border-white/10 bg-zinc-900/60"
      }`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-red-400/15 bg-red-500/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
            Before
          </p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            {item.original}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
            After
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-100">
            {item.improved}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-zinc-400">
          <span className="font-semibold text-zinc-300">Why?</span>{" "}
          {item.reason}
        </p>
        <button
          type="button"
          disabled={applied}
          onClick={onApply}
          className={`ml-4 flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            applied
              ? "bg-green-600/20 text-green-300"
              : "bg-violet-600 text-white hover:bg-violet-500"
          }`}
        >
          {applied ? "✓ Applied" : "Apply This"}
        </button>
      </div>
    </article>
  );
}
