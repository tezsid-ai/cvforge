"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ImprovementItem } from "@/types/analysis";
import ChallengeForm from "@/components/challenge/ChallengeForm";

type ApplyChangesPanelProps = {
  improvements: ImprovementItem[];
};

type ChallengeData = { problem: string; action: string; result: string };

export default function ApplyChangesPanel({
  improvements,
}: ApplyChangesPanelProps): React.JSX.Element {
  const router = useRouter();
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [showChallenge, setShowChallenge] = useState(false);

  const onApplyAll = async (): Promise<void> => {
    if (applyLoading) return;

    const originalResume = sessionStorage.getItem("originalResume")?.trim();
    if (!originalResume) {
      setApplyError("Original resume data is missing. Please re-run analysis.");
      return;
    }

    setApplyLoading(true);
    setApplyError("");

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalResume,
          improvements: improvements.map(({ original, improved }) => ({
            original,
            improved,
          })),
        }),
      });

      const data = (await response.json()) as { finalResume?: string };
      if (!response.ok || !data.finalResume) {
        throw new Error("Failed to generate final resume.");
      }

      sessionStorage.setItem("finalResume", data.finalResume);
      setShowChallenge(true);
    } catch {
      setApplyError("Could not apply changes right now. Please try again.");
    } finally {
      setApplyLoading(false);
    }
  };

  const handleChallenge = (result: ChallengeData) => {
    const existing = sessionStorage.getItem("finalResume") ?? "";
    const challengeBlock = `\n\nHow I Solved a Professional Challenge\nProblem: ${result.problem}\nAction: ${result.action}\nResult: ${result.result}`;
    sessionStorage.setItem("finalResume", existing + challengeBlock);
    router.push("/preview");
  };

  const handleSkip = () => {
    router.push("/preview");
  };

  if (showChallenge) {
    return (
      <ChallengeForm onComplete={handleChallenge} onSkip={handleSkip} />
    );
  }

  return (
    <section className="animate-fade-in-up rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
      <button
        type="button"
        disabled={applyLoading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => { void onApplyAll(); }}
      >
        {applyLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Applying Changes...
          </>
        ) : (
          "Apply All Changes"
        )}
      </button>
      {applyError ? (
        <p className="mt-3 text-sm text-red-400">{applyError}</p>
      ) : null}
    </section>
  );
}
