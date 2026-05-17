type ScoreCardProps = {
  score: number;
  compact?: boolean;
};

function getColor(score: number) {
  if (score <= 40) return { ring: "#ef4444", text: "text-red-400", bg: "stroke-red-500" };
  if (score <= 70) return { ring: "#eab308", text: "text-yellow-300", bg: "stroke-yellow-500" };
  return { ring: "#22c55e", text: "text-green-400", bg: "stroke-green-500" };
}

function getMessage(score: number): string {
  if (score <= 40) return "Needs significant improvement";
  if (score <= 70) return "Good start, apply suggestions below";
  return "Strong match! Minor tweaks recommended";
}

export default function ScoreCard({
  score,
  compact = false,
}: ScoreCardProps): React.JSX.Element {
  const { text, bg } = getColor(score);
  const size = compact ? 48 : 120;
  const strokeWidth = compact ? 4 : 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#27272a" strokeWidth={strokeWidth} />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" className={bg} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
        </svg>
        <span className={`text-sm font-bold ${text}`}>{score}%</span>
      </div>
    );
  }

  return (
    <section className="animate-fade-in-up rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
        <div className="relative flex-shrink-0">
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#27272a" strokeWidth={strokeWidth} />
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" className={bg} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${text}`}>
            {score}%
          </span>
        </div>
        <div>
          <p className="text-sm text-zinc-300">
            Your resume matches <span className={`font-semibold ${text}`}>{score}%</span> of the job description
          </p>
          <p className={`mt-1 text-xs ${text}`}>{getMessage(score)}</p>
        </div>
      </div>
    </section>
  );
}
