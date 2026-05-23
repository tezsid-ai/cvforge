import { AlertTriangle } from "lucide-react";
import type { WeakPoint } from "@/types/analysis";

type WeakPointsListProps = {
  weakPoints?: WeakPoint[];
};

export default function WeakPointsList({
  weakPoints = [],
}: WeakPointsListProps): React.JSX.Element | null {
  if (!weakPoints || weakPoints.length === 0) return null;

  return (
    <section className="animate-fade-in-up space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
        Critical Weak Points
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {weakPoints.map((item, i) => (
          <div
            key={`${item.section}-${i}`}
            className="flex flex-col justify-between rounded-xl border border-red-500/10 bg-red-950/5 p-5 backdrop-blur-xs hover:border-red-500/20 transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-md bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-400 border border-red-500/20">
                  {item.section}
                </span>
                <span className="flex items-center text-red-400 text-xs font-medium">
                  <AlertTriangle className="h-3.5 w-3.5 mr-1 text-red-400 shrink-0" />
                  Weak Point
                </span>
              </div>
              <p className="mt-3 text-sm font-medium text-white">
                {item.issue}
              </p>
            </div>
            <div className="mt-4 border-t border-red-500/10 pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Actionable Fix:
              </span>
              <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
                {item.fix}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
