"use client";

import { CheckCircle2, XCircle } from "lucide-react";

type AtsScoreSectionProps = {
  score: number;
  atsVerdict?: string;
  matchedCount: number;
  missingCount: number;
};

export default function AtsScoreSection({
  score,
  atsVerdict,
  matchedCount,
  missingCount,
}: AtsScoreSectionProps): React.JSX.Element {
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let colorClass = "text-green-400";
  let strokeClass = "stroke-green-500";
  if (score <= 40) {
    colorClass = "text-red-400";
    strokeClass = "stroke-red-500";
  } else if (score <= 70) {
    colorClass = "text-yellow-300";
    strokeClass = "stroke-yellow-500";
  }

  return (
    <section className="animate-fade-in-up rounded-2xl border border-white/10 bg-zinc-900/60 p-6 space-y-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8 justify-between">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <div className="relative flex-shrink-0">
            <svg width={size} height={size} className="-rotate-90">
              <title>ATS Optimization Circle Chart</title>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#27272a"
                strokeWidth={strokeWidth}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                className={strokeClass}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.8s ease" }}
              />
            </svg>
            <span
              className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${colorClass}`}
            >
              {score}%
            </span>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-white">
              ATS Optimization Score
            </h2>
            <p className="text-sm text-zinc-300">
              Your resume matches{" "}
              <span className={`font-semibold ${colorClass}`}>{score}%</span> of
              the job description keywords.
            </p>
          </div>
        </div>

        <div className="flex gap-4 sm:gap-6 border-t border-white/5 pt-4 sm:border-t-0 sm:pt-0">
          <div className="text-center sm:text-right">
            <span className="flex items-center gap-1.5 justify-center sm:justify-end text-green-400 text-xs font-semibold uppercase tracking-wider">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
              Matched
            </span>
            <p className="mt-1 text-2xl font-bold text-white">{matchedCount}</p>
          </div>
          <div className="h-8 w-px bg-white/10 self-center" />
          <div className="text-center sm:text-left">
            <span className="flex items-center gap-1.5 justify-center sm:justify-start text-red-400 text-xs font-semibold uppercase tracking-wider">
              <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
              Missing
            </span>
            <p className="mt-1 text-2xl font-bold text-white">{missingCount}</p>
          </div>
        </div>
      </div>

      {atsVerdict && (
        <div className="border-t border-white/5 pt-4">
          <div className="text-sm italic text-zinc-300 bg-zinc-950/40 p-4 rounded-xl border border-white/5 leading-relaxed">
            <span className="font-semibold text-violet-400 not-italic block mb-1 text-xs uppercase tracking-wider">
              ATS Verdict:
            </span>
            "{atsVerdict}"
          </div>
        </div>
      )}
    </section>
  );
}
