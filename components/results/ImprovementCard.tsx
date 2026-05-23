"use client";

import type { ImprovementItem } from "@/types/analysis";
import { Check } from "lucide-react";

type ImprovementCardProps = {
  item: ImprovementItem;
  index: number;
  selected: boolean;
  onToggle: () => void;
};

export default function ImprovementCard({
  item,
  index,
  selected,
  onToggle,
}: ImprovementCardProps): React.JSX.Element {
  return (
    <article
      className={`animate-fade-in-up rounded-2xl border p-5 transition-all duration-300 ${
        selected
          ? "border-emerald-500/25 bg-emerald-500/5"
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

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-xs text-zinc-400 leading-relaxed">
          <span className="font-semibold text-zinc-300">Why?</span>{" "}
          {item.reason}
        </p>
        <button
          type="button"
          onClick={onToggle}
          className={`flex-shrink-0 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            selected
              ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30"
              : "bg-violet-600 text-white hover:bg-violet-500"
          }`}
        >
          {selected ? (
            <>
              <Check className="h-3 w-3 text-emerald-300 shrink-0" />
              Applied
            </>
          ) : (
            "Apply This"
          )}
        </button>
      </div>
    </article>
  );
}
