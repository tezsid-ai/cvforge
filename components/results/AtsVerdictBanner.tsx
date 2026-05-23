import { Megaphone } from "lucide-react";

type AtsVerdictBannerProps = {
  verdict?: string;
};

export default function AtsVerdictBanner({
  verdict,
}: AtsVerdictBannerProps): React.JSX.Element | null {
  if (!verdict) return null;

  return (
    <section className="animate-fade-in-up rounded-2xl border border-violet-500/20 bg-linear-to-r from-violet-950/40 to-indigo-950/40 p-5 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Megaphone className="h-5 w-5 text-violet-400 shrink-0" />
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            ATS Verdict & Recruiter Review
          </h3>
          <p className="mt-1 text-sm font-medium text-zinc-100 sm:text-base leading-relaxed">
            {verdict}
          </p>
        </div>
      </div>
    </section>
  );
}
