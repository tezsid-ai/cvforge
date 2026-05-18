"use client";

import BackButton from "@/components/ui/BackButton";
import ScoreCard from "./ScoreCard";

type ResultsHeaderProps = {
  score: number;
  onApplyAll: () => void;
  applyLoading: boolean;
};

export default function ResultsHeader({
  score,
  onApplyAll,
  applyLoading,
}: ResultsHeaderProps): React.JSX.Element {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0a]/90 px-6 py-3 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <BackButton href="/upload" label="Back to Upload" size="sm" />

        <ScoreCard score={score} compact />

        <button
          type="button"
          disabled={applyLoading}
          onClick={onApplyAll}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
        >
          {applyLoading ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Applying...
            </>
          ) : (
            "Apply All Changes"
          )}
        </button>
      </div>
    </header>
  );
}
