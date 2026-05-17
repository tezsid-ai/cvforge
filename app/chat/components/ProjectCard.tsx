"use client";

import { useState } from "react";

type ProjectCardProps = {
  onSubmit: (project: string) => void;
};

export default function ProjectCard({
  onSubmit,
}: ProjectCardProps): React.JSX.Element {
  const [name, setName] = useState("");
  const [stack, setStack] = useState("");
  const [bullets, setBullets] = useState(["", "", ""]);

  const updateBullet = (i: number, val: string) => {
    setBullets((prev) => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
  };

  const handleSubmit = () => {
    const filled = bullets.filter((b) => b.trim());
    const text = `Project: ${name}\nTech Stack: ${stack}\n${filled.map((b) => `- ${b}`).join("\n")}`;
    onSubmit(text);
  };

  const fieldClass =
    "w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-500";

  return (
    <div className="space-y-3 rounded-xl border border-zinc-700 bg-zinc-800/40 p-4">
      <h3 className="text-sm font-semibold text-zinc-200">Add a Project</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project Name"
        className={fieldClass}
      />
      <input
        type="text"
        value={stack}
        onChange={(e) => setStack(e.target.value)}
        placeholder="Tech Stack (e.g. React, Node.js)"
        className={fieldClass}
      />
      {bullets.map((b, i) => (
        <input
          key={i}
          type="text"
          value={b}
          onChange={(e) => updateBullet(i, e.target.value)}
          placeholder={`Bullet point ${i + 1}`}
          className={fieldClass}
        />
      ))}
      <button
        type="button"
        disabled={!name.trim()}
        onClick={handleSubmit}
        className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-40"
      >
        Add Project
      </button>
    </div>
  );
}
