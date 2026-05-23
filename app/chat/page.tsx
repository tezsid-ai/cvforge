"use client";

import { useState } from "react";
import { Sparkles, ClipboardList } from "lucide-react";
import ChatWindow from "./components/ChatWindow";
import BackButton from "@/components/ui/BackButton";

type Mode = "landing" | "withJd" | "chat";

export default function ChatPage(): React.JSX.Element {
  const [mode, setMode] = useState<Mode>("landing");
  const [jd, setJd] = useState("");
  const [jdReady, setJdReady] = useState(false);

  if (mode === "chat" || (mode === "withJd" && jdReady)) {
    if (mode === "withJd" && (!jd.trim() || !jdReady)) {
      setJdReady(false);
      setMode("landing");
      return <></>;
    }

    return (
      <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-zinc-100">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/3 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-6">
          <div className="mb-4">
            <BackButton href="/" label="Back to Home" size="sm" />
          </div>
          <h1 className="mb-2 text-center text-xl font-bold text-white">
            AI Resume Builder
          </h1>
          <ChatWindow
            jobDescription={mode === "withJd" ? jd : ""}
            mode={mode === "withJd" ? "withJd" : "scratch"}
          />
        </div>
      </main>
    );
  }

  if (mode === "withJd") {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a] px-6 text-zinc-100">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
        </div>
        <section className="relative z-10 w-full max-w-xl animate-fade-in-up space-y-5">
          <div>
            <BackButton href="/" label="Back to Home" size="sm" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Paste your Job Description
          </h2>
          <p className="text-sm text-zinc-400">
            The AI will tailor your resume to match this role.
          </p>
          <textarea
            rows={8}
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here..."
            className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-violet-500"
          />
          <div className="flex gap-3">
            <button
              type="button"
              disabled={!jd.trim()}
              onClick={() => setJdReady(true)}
              className="flex-1 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-40"
            >
              Start Building →
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a] px-6 text-zinc-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-3xl animate-fade-in-up space-y-6 text-center">
        <section className="space-y-8">
          <div>
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1 text-sm font-medium text-violet-200">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" /> Build From Scratch
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How do you want to start?
            </h1>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setJdReady(false);
                setMode("withJd");
              }}
              className="group rounded-2xl border border-white/10 bg-zinc-900/60 p-7 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/70 hover:shadow-[0_0_0_1px_rgba(167,139,250,0.45),0_14px_45px_rgba(79,70,229,0.28)]"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg shadow-indigo-500/25">
                <ClipboardList className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                I Have a Job Description
              </h2>
              <p className="mt-1.5 text-sm text-zinc-400">
                Paste it and get a resume tailored to the role.
              </p>
            </button>
            <button
              type="button"
              onClick={() => {
                setJd("");
                setJdReady(false);
                setMode("chat");
              }}
              className="group rounded-2xl border border-white/10 bg-zinc-900/60 p-7 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/70 hover:shadow-[0_0_0_1px_rgba(167,139,250,0.45),0_14px_45px_rgba(79,70,229,0.28)]"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg shadow-indigo-500/25">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Start From Scratch
              </h2>
              <p className="mt-1.5 text-sm text-zinc-400">
                No JD? No problem. Build a great resume anyway.
              </p>
            </button>
          </div>
        </section>
        <div className="flex justify-center">
          <BackButton href="/" label="Back to Home" size="sm" />
        </div>
      </div>
    </main>
  );
}
