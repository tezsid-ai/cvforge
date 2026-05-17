"use client";

type AnalyzeButtonProps = {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
};

export default function AnalyzeButton({
  loading,
  disabled,
  onClick,
}: AnalyzeButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Analyzing...
        </>
      ) : (
        "Analyze Resume"
      )}
    </button>
  );
}
