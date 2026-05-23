import BackButton from "@/components/ui/BackButton";
import ScoreCard from "./ScoreCard";

type ResultsHeaderProps = {
  score: number;
};

export default function ResultsHeader({
  score,
}: ResultsHeaderProps): React.JSX.Element {
  return (
    <header className="border-b border-white/10 bg-[#0a0a0a] px-6 py-4">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <BackButton href="/upload" label="Back to Upload" size="sm" />
        <ScoreCard score={score} compact />
      </div>
    </header>
  );
}
