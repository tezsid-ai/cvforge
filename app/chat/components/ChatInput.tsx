"use client";

import { useState } from "react";

type ChatInputProps = {
  onSubmit: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  disabled?: boolean;
};

export default function ChatInput({
  onSubmit,
  placeholder = "Type your answer...",
  multiline = false,
  disabled = false,
}: ChatInputProps): React.JSX.Element {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const inputClasses =
    "flex-1 resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-violet-500";

  return (
    <div className="flex gap-2">
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
        />
      )}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-40"
      >
        Send
      </button>
    </div>
  );
}
