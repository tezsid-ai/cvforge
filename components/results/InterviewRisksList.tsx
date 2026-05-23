"use client";

type InterviewRisksListProps = {
  risks?: string[];
};

export default function InterviewRisksList({
  risks = [],
}: InterviewRisksListProps): React.JSX.Element | null {
  if (!risks || risks.length === 0) return null;

  return (
    <section className="animate-fade-in-up rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4">
        Interview Risks & Recruiter Hesitations
      </h3>
      <ul className="space-y-3 pl-1">
        {risks.map((risk, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-[10px] font-bold text-amber-400 border border-amber-500/25"
              aria-hidden="true"
            >
              ?
            </span>
            <span className="text-sm text-zinc-200 leading-relaxed">
              {risk}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
