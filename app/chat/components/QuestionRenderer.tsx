"use client";

import { useState, useEffect } from "react";
import type { Question } from "@/lib/chatQuestions";

type QuestionRendererProps = {
  question: Question;
  onAnswer: (value: string) => void;
  disabled: boolean;
};

export default function QuestionRenderer({
  question,
  onAnswer,
  disabled,
}: QuestionRendererProps): React.JSX.Element {
  const [textVal, setTextVal] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [exp, setExp] = useState({ role: "", company: "", duration: "", desc: "" });
  const [error, setError] = useState<string | null>(null);

  // Clear inputs when question changes
  useEffect(() => {
    setTextVal("");
    setSelected([]);
    setExp({ role: "", company: "", duration: "", desc: "" });
    setError(null);
  }, [question.id]);

  const handleTextSubmit = () => {
    if (!textVal.trim()) {
      setError("This field cannot be empty.");
      return;
    }
    setError(null);
    onAnswer(textVal.trim());
  };

  const handleMultiSubmit = () => {
    if (selected.length === 0) {
      setError("Please select at least one option.");
      return;
    }
    setError(null);
    onAnswer(selected.join(", "));
  };

  const handleExpSubmit = () => {
    if (!exp.role.trim() || !exp.company.trim() || !exp.duration.trim() || !exp.desc.trim()) {
      setError("All fields are required. Please fill them out.");
      return;
    }
    setError(null);
    onAnswer(
      `Role: ${exp.role.trim()} at ${exp.company.trim()} (${exp.duration.trim()})\nDescription: ${exp.desc.trim()}`
    );
  };

  const toggleSelect = (opt: string) => {
    setError(null);
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  const inputClass = "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-500 transition";

  if (question.type === "select") {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {question.options?.map((opt) => (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => onAnswer(opt)}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:border-violet-500 hover:text-white transition"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === "multiselect") {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {question.options?.map((opt) => {
            const isSel = selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                disabled={disabled}
                onClick={() => toggleSelect(opt)}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${isSel ? "border-violet-500 bg-violet-600/20 text-white" : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
        <button
          type="button"
          disabled={disabled}
          onClick={handleMultiSubmit}
          className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition"
        >
          Confirm Skills
        </button>
      </div>
    );
  }

  if (question.type === "experience") {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <input type="text" placeholder="Job Title / Role" value={exp.role} onChange={(e) => setExp({ ...exp, role: e.target.value })} className={inputClass} />
          <input type="text" placeholder="Company / Org" value={exp.company} onChange={(e) => setExp({ ...exp, company: e.target.value })} className={inputClass} />
          <input type="text" placeholder="Duration (e.g. 6 mos)" value={exp.duration} onChange={(e) => setExp({ ...exp, duration: e.target.value })} className={inputClass} />
        </div>
        <textarea rows={3} placeholder="Key responsibilities and achievements..." value={exp.desc} onChange={(e) => setExp({ ...exp, desc: e.target.value })} className={inputClass + " resize-none"} />
        {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
        <button type="button" disabled={disabled} onClick={handleExpSubmit} className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition">
          Submit Experience
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {question.type === "textarea" ? (
          <textarea
            rows={3}
            placeholder="Type your answer here..."
            value={textVal}
            onChange={(e) => { setTextVal(e.target.value); setError(null); }}
            className={inputClass + " flex-1 resize-none"}
          />
        ) : (
          <input
            type="text"
            placeholder="Type your answer here..."
            value={textVal}
            onChange={(e) => { setTextVal(e.target.value); setError(null); }}
            className={inputClass + " flex-1"}
          />
        )}
        <button
          type="button"
          disabled={disabled || !textVal.trim()}
          onClick={handleTextSubmit}
          className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-40"
        >
          Send
        </button>
      </div>
      {error && <p className="text-xs text-red-400 font-medium pl-1">{error}</p>}
    </div>
  );
}
