import { ArrowRight } from "lucide-react";
import type { ReframingSuggestion } from "@/types/analysis";

type ReframingSuggestionsListProps = {
  suggestions?: ReframingSuggestion[];
};

export default function ReframingSuggestionsList({
  suggestions = [],
}: ReframingSuggestionsListProps): React.JSX.Element | null {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <section className="animate-fade-in-up space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
        Strategic Reframing Suggestions
      </h3>
      <div className="space-y-4">
        {suggestions.map((item, i) => (
          <div
            key={i}
            className="grid gap-4 rounded-xl border border-white/5 bg-zinc-950/40 p-5 sm:grid-cols-2 items-center hover:border-white/10 transition-colors duration-300"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Current Framing (Weak/Generic)
              </span>
              <p className="text-sm text-zinc-400 leading-relaxed pl-3 border-l-2 border-zinc-700">
                {item.current}
              </p>
            </div>

            <div className="space-y-1 sm:border-l sm:border-white/5 sm:pl-6">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                  Recommended Reframing (ATS-Aligned)
                </span>
              </div>
              <p className="text-sm font-medium text-white leading-relaxed pl-3 border-l-2 border-violet-500">
                {item.reframed}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
