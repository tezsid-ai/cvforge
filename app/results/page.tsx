"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AtsScoreSection from "@/components/results/AtsScoreSection";
import ImprovementsSection from "@/components/results/ImprovementsSection";
import KeywordChips from "@/components/results/KeywordChips";
import RecommendedAdditionsList from "@/components/results/RecommendedAdditionsList";
import ResultsHeader from "@/components/results/ResultsHeader";
import WeakPointsList from "@/components/results/WeakPointsList";
import BackButton from "@/components/ui/BackButton";
import { type AnalysisResult, isAnalysisResult } from "@/types/analysis";

export default function ResultsPage(): React.JSX.Element {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadError, setLoadError] = useState("");
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    new Set(),
  );
  const [applyLoading, setApplyLoading] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("analysisResult");
    if (!raw) {
      setLoadError("No analysis data found. Please upload your resume again.");
      return;
    }
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!isAnalysisResult(parsed)) {
        setLoadError("Stored analysis is invalid.");
        return;
      }
      setResult(parsed);
    } catch {
      setLoadError("Could not read analysis data.");
    }
  }, []);

  const onToggleIndex = (i: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

  const onApplySelected = async () => {
    if (!result || applyLoading || selectedIndices.size === 0) return;
    const originalResume = sessionStorage.getItem("originalResume")?.trim();
    if (!originalResume) return;

    setApplyLoading(true);
    const selectedImprovements = result.improvements.filter((_, i) =>
      selectedIndices.has(i),
    );
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalResume,
          improvements: selectedImprovements.map(({ original, improved }) => ({
            original,
            improved,
          })),
        }),
      });
      const data = (await res.json()) as { finalResume?: string };
      if (!res.ok || !data.finalResume) throw new Error();
      sessionStorage.setItem("finalResume", data.finalResume);
      sessionStorage.setItem("resumeSource", "upload");
      router.push("/preview");
    } catch {
      let fallbackResume = originalResume;
      for (const imp of selectedImprovements) {
        if (imp.original && imp.improved) {
          fallbackResume = fallbackResume.replace(imp.original, imp.improved);
        }
      }
      sessionStorage.setItem("finalResume", fallbackResume);
      sessionStorage.setItem("resumeSource", "upload");
      router.push("/preview");
    } finally {
      setApplyLoading(false);
    }
  };

  const onContinueWithoutChanges = async () => {
    if (!result || applyLoading) return;
    const originalResume = sessionStorage.getItem("originalResume")?.trim();
    if (!originalResume) return;

    setApplyLoading(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalResume,
          improvements: [],
        }),
      });
      const data = (await res.json()) as { finalResume?: string };
      if (!res.ok || !data.finalResume) throw new Error();
      sessionStorage.setItem("finalResume", data.finalResume);
      sessionStorage.setItem("resumeSource", "upload");
      router.push("/preview");
    } catch {
      sessionStorage.setItem("finalResume", originalResume);
      sessionStorage.setItem("resumeSource", "upload");
      router.push("/preview");
    } finally {
      setApplyLoading(false);
    }
  };

  if (loadError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 text-zinc-200">
        <section className="w-full max-w-lg rounded-2xl border border-red-400/30 bg-zinc-950/80 p-6 text-center">
          <h1 className="text-xl font-semibold text-white">
            Unable to load results
          </h1>
          <p className="mt-2 text-sm text-zinc-300">{loadError}</p>
          <div className="mt-5 flex justify-center">
            <BackButton href="/upload" label="Back to Upload" />
          </div>
        </section>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-zinc-200">
        <p className="animate-pulse text-sm text-zinc-400">
          Loading analysis...
        </p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-zinc-100">
      <ResultsHeader score={result.matchScore} />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/3 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
      </div>
      <section className="relative z-10 mx-auto w-full max-w-5xl space-y-8 px-6 py-8 sm:px-10">
        {/* Section 1: ATS Score */}
        <AtsScoreSection
          score={result.matchScore}
          atsVerdict={result.atsVerdict}
          matchedCount={result.matchedKeywords?.length ?? 0}
          missingCount={result.missingKeywords?.length ?? 0}
        />

        {/* Section 2: Missing Keywords */}
        <KeywordChips
          missingKeywords={result.missingKeywords}
          matchedKeywords={result.matchedKeywords ?? []}
        />

        {/* Section 3: Weak Points */}
        <WeakPointsList weakPoints={result.weakPoints} />

        {/* Section 4: Recommended Additions */}
        <RecommendedAdditionsList additions={result.recommendedAdditions} />

        {/* Section 5: Resume Improvements */}
        <ImprovementsSection
          improvements={result.improvements}
          selectedIndices={selectedIndices}
          onToggleIndex={onToggleIndex}
        />

        {/* Inline action buttons directly below improvements */}
        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <button
            type="button"
            disabled={applyLoading}
            onClick={() => {
              void onContinueWithoutChanges();
            }}
            className="rounded-lg border border-zinc-700 bg-zinc-900/50 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {applyLoading ? "Processing..." : "Continue without changes"}
          </button>
          <button
            type="button"
            disabled={applyLoading || selectedIndices.size === 0}
            onClick={() => {
              void onApplySelected();
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
          >
            {applyLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Applying Selected...
              </>
            ) : (
              "Apply Selected Changes"
            )}
          </button>
        </div>
      </section>
    </main>
  );
}
