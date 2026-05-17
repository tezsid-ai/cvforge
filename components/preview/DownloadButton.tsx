"use client";

type DownloadButtonProps = {
  disabled?: boolean;
};

export default function DownloadButton({
  disabled = false,
}: DownloadButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => window.print()}
      className="no-print inline-flex items-center justify-center rounded-xl bg-linear-to-r from-violet-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Download PDF
    </button>
  );
}
