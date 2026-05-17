"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImprovementCard from "@/components/results/ImprovementCard";
import KeywordChips from "@/components/results/KeywordChips";
import ScoreCard from "@/components/results/ScoreCard";
import ResultsHeader from "@/components/results/ResultsHeader";
import ChallengeForm from "@/components/challenge/ChallengeForm";
import { isAnalysisResult, type AnalysisResult } from "@/types/analysis";

export default function ResultsPage(): React.JSX.Element {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadError, setLoadError] = useState("");
  const [applied, setApplied] = useState<Set<number>>(new Set());
  const [applyLoading, setApplyLoading] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("analysisResult");
    if (!raw) { setLoadError("No analysis data found. Please upload your resume again."); return; }
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!isAnalysisResult(parsed)) { setLoadError("Stored analysis is invalid."); return; }
      setResult(parsed);
    } catch { setLoadError("Could not read analysis data."); }
  }, []);

  const markApplied = (i: number) => setApplied((prev) => new Set(prev).add(i));

  const onApplyAll = async () => {
    if (!result || applyLoading) return;
    const originalResume = sessionStorage.getItem("originalResume")?.trim();
    if (!originalResume) return;

    setApplyLoading(true);
    const unapplied = result.improvements.filter((_, i) => !applied.has(i));
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalResume,
          improvements: unapplied.map(({ original, improved }) => ({ original, improved })),
        }),
      });
      const data = (await res.json()) as { finalResume?: string };
      if (!res.ok || !data.finalResume) throw new Error();
      sessionStorage.setItem("finalResume", data.finalResume);
      setShowChallenge(true);
    } catch { /* error handled silently */ }
    finally { setApplyLoading(false); }
  };

  if (loadError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 text-zinc-200">
        <section className="w-full max-w-lg rounded-2xl border border-red-400/30 bg-zinc-950/80 p-6 text-center">
          <h1 className="text-xl font-semibold text-white">Unable to load results</h1>
          <p className="mt-2 text-sm text-zinc-300">{loadError}</p>
          <button type="button" onClick={() => router.push("/upload")} className="mt-5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500">Go Back</button>
        </section>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-zinc-200">
        <p className="animate-pulse text-sm text-zinc-400">Loading analysis...</p>
      </main>
    );
  }

  if (showChallenge) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 text-zinc-100">
        <div className="w-full max-w-xl">
          <ChallengeForm
            onComplete={(c) => {
              const existing = sessionStorage.getItem("finalResume") ?? "";
              sessionStorage.setItem("finalResume", `${existing}\n\nHow I Solved a Professional Challenge\nProblem: ${c.problem}\nAction: ${c.action}\nResult: ${c.result}`);
              router.push("/preview");
            }}
            onSkip={() => router.push("/preview")}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-zinc-100">
      <ResultsHeader score={result.matchScore} onApplyAll={() => { void onApplyAll(); }} applyLoading={applyLoading} />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/3 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
      </div>
      <section className="relative z-10 mx-auto w-full max-w-5xl space-y-6 px-6 py-8 sm:px-10">
        <ScoreCard score={result.matchScore} />
        <KeywordChips missingKeywords={result.missingKeywords} matchedKeywords={result.matchedKeywords ?? []} />
        <section className="animate-fade-in-up rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
          <h2 className="text-lg font-semibold text-white">Resume Improvements</h2>
          {result.improvements.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-300">Your resume is already strong</p>
          ) : (
            <div className="mt-4 space-y-4">
              {result.improvements.map((item, i) => (
                <ImprovementCard key={`${item.original}-${i}`} item={item} index={i} applied={applied.has(i)} onApply={() => markApplied(i)} />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
