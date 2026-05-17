"use client";

type JDInputProps = {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
};

export default function JDInput({
  value,
  onChange,
  maxLength = 10000,
}: JDInputProps): React.JSX.Element {
  const used = value.length;
  const remaining = maxLength - used;

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Job Description</h2>
        <span className="text-xs text-zinc-400">
          {used}/{maxLength}
        </span>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, maxLength))}
        placeholder="Paste the job description here..."
        rows={11}
        className="mt-3 w-full resize-y rounded-2xl border border-white/10 bg-zinc-900/60 p-4 text-sm leading-relaxed text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/30"
      />

      <p className="mt-2 text-xs text-zinc-500">
        {remaining} characters remaining.
      </p>
    </section>
  );
}
