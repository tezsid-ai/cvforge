"use client";

import { useState } from "react";

type ChallengeResult = {
  problem: string;
  action: string;
  result: string;
};

type ChallengeFormProps = {
  onComplete: (result: ChallengeResult) => void;
  onSkip?: () => void;
};

export default function ChallengeForm({
  onComplete,
  onSkip,
}: ChallengeFormProps): React.JSX.Element {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeText: text }),
      });

      const data = (await res.json()) as ChallengeResult & { error?: string };
      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Failed");
      }

      onComplete({
        problem: data.problem,
        action: data.action,
        result: data.result,
      });
    } catch {
      setError("Could not enhance the challenge. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="animate-fade-in-up rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
      <h2 className="text-lg font-bold text-white">
        One Last Thing — Stand Out From The Crowd
      </h2>
      <p className="mt-1.5 text-sm text-zinc-400">
        Tell us about a real challenge you solved. AI will make it sound
        impressive.
      </p>

      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. Our app was crashing for 30% of users. I debugged the issue, found a memory leak, fixed it and crashes dropped to 0%."
        className="mt-4 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-violet-500"
      />

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      <div className="mt-4 flex gap-3">
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500"
          >
            Skip
          </button>
        )}
        <button
          type="button"
          disabled={!text.trim() || loading}
          onClick={() => {
            void handleSubmit();
          }}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Enhancing...
            </>
          ) : (
            "Enhance & Add to Resume"
          )}
        </button>
      </div>
    </section>
  );
}
