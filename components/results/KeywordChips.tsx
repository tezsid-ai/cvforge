import { XCircle, CheckCircle2 } from "lucide-react";

type KeywordChipsProps = {
  missingKeywords: string[];
  matchedKeywords: string[];
};

export default function KeywordChips({
  missingKeywords,
  matchedKeywords,
}: KeywordChipsProps): React.JSX.Element {
  return (
    <section className="animate-fade-in-up rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Missing */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-red-400">
              <XCircle className="h-4 w-4 text-red-400 shrink-0" />
              {missingKeywords.length} Missing
            </span>
          </div>
          {missingKeywords.length === 0 ? (
            <p className="text-xs text-zinc-400">No major keywords missing</p>
          ) : (
            <div className="flex flex-wrap gap-1.5 overflow-hidden">
              {missingKeywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full border border-red-400/30 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-300 break-words max-w-full"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Matched */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-green-400">
              <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
              {matchedKeywords.length} Matched
            </span>
          </div>
          {matchedKeywords.length === 0 ? (
            <p className="text-xs text-zinc-400">No keywords matched yet</p>
          ) : (
            <div className="flex flex-wrap gap-1.5 overflow-hidden">
              {matchedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full border border-green-400/30 bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-300 break-words max-w-full"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
