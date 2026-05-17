"use client";

type FileDropProps = {
  file: File | null;
  onFileSelect: (file: File) => void;
  error: string;
  setError: (value: string) => void;
};

function isPdf(file: File): boolean {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}

export default function FileDrop({
  file,
  onFileSelect,
  error,
  setError,
}: FileDropProps): React.JSX.Element {
  const handleFile = (nextFile: File | null): void => {
    if (!nextFile) {
      return;
    }

    if (!isPdf(nextFile)) {
      setError("Only PDF files are allowed.");
      return;
    }

    setError("");
    onFileSelect(nextFile);
  };

  return (
    <section>
      <h2 className="text-lg font-semibold text-white">Resume Upload</h2>
      <label
        htmlFor="resume-file"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFile(event.dataTransfer.files?.[0] ?? null);
        }}
        className="mt-3 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-violet-300/35 bg-zinc-900/50 p-6 text-center transition hover:border-violet-400/80 hover:bg-zinc-900"
      >
        <span className="text-4xl" aria-hidden="true">
          📎
        </span>
        <p className="mt-3 text-sm text-zinc-300">
          Drag and drop your resume (PDF only)
        </p>
        <p className="mt-1 text-xs text-zinc-500">or click to select a file</p>
        <input
          id="resume-file"
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
        />
      </label>

      {file ? (
        <p className="mt-3 text-sm text-violet-200">Selected: {file.name}</p>
      ) : (
        <p className="mt-3 text-sm text-zinc-400">No file selected yet.</p>
      )}

      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
    </section>
  );
}
