"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DownloadButton from "@/components/preview/DownloadButton";
import ResumeTemplate from "@/components/preview/ResumeTemplate";
import BackButton from "@/components/ui/BackButton";
import { parseResumeText } from "@/lib/resumeParser";
import type { ResumeData } from "@/types/resume";

type PageState = "loading" | "empty" | "ready";

function isResumeDataShape(value: unknown): value is ResumeData {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.name === "string" && typeof v.summary === "string";
}

function resolveResumeData(raw: string): ResumeData {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (isResumeDataShape(parsed)) {
      console.log("[Preview] Parsed as JSON ResumeData");
      return parsed;
    }
  } catch {
    // Not JSON — fall through to plain text parsing
  }

  console.log("[Preview] Parsing as plain text");
  return parseResumeText(raw);
}

export default function PreviewPage(): React.JSX.Element {
  const router = useRouter();
  const [data, setData] = useState<ResumeData | null>(null);
  const [state, setState] = useState<PageState>("loading");
  const [linkedinUrl, setLinkedinUrl] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState<string | null>(null);
  const [portfolioUrl, setPortfolioUrl] = useState<string | null>(null);
  const [otherLinks, setOtherLinks] = useState<string[] | null>(null);
  const [backTarget, setBackTarget] = useState({
    href: "/results",
    label: "Back to Results",
  });

  useEffect(() => {
    const raw = sessionStorage.getItem("finalResume");
    console.log("[Preview] Raw sessionStorage value:", raw);

    const source = sessionStorage.getItem("resumeSource");
    if (source === "chat") {
      setBackTarget({ href: "/chat", label: "Back to Builder" });
    }

    const analysisResultRaw = sessionStorage.getItem("analysisResult");
    if (analysisResultRaw) {
      try {
        const parsed = JSON.parse(analysisResultRaw);
        if (parsed.linkedinUrl) {
          setLinkedinUrl(parsed.linkedinUrl);
        }
        if (parsed.githubUrl) {
          setGithubUrl(parsed.githubUrl);
        }
        if (parsed.portfolioUrl) {
          setPortfolioUrl(parsed.portfolioUrl);
        }
        if (parsed.otherLinks) {
          setOtherLinks(parsed.otherLinks);
        }
      } catch (e) {
        console.error("Failed to parse analysisResult for URLs", e);
      }
    }

    // Case 1: Nothing stored
    if (!raw || !raw.trim()) {
      console.warn("[Preview] No finalResume in sessionStorage");
      setState("empty");
      return;
    }

    const resolved = resolveResumeData(raw);
    console.log("[Preview] Resolved ResumeData:", resolved);
    setData(resolved);
    setState("ready");
  }, []);

  if (state === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-zinc-200">
        <p className="animate-pulse text-sm text-zinc-400">
          Loading optimized resume...
        </p>
      </main>
    );
  }

  if (state === "empty" || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 text-zinc-200">
        <section className="w-full max-w-md rounded-2xl border border-red-400/30 bg-zinc-950/80 p-8 text-center">
          <h1 className="text-xl font-semibold text-white">
            No resume data found
          </h1>
          <p className="mt-2 text-sm text-zinc-300">
            Please go back and try again.
          </p>
          <div className="mt-5 flex justify-center">
            <BackButton href={backTarget.href} label={backTarget.label} />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-10 sm:px-10 print:bg-white print:p-0">
      <section className="no-print print:hidden mx-auto mb-6 flex w-full max-w-3xl flex-wrap items-center justify-between gap-3">
        <BackButton href={backTarget.href} label={backTarget.label} size="sm" />
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Your Optimized Resume
        </h1>
        <DownloadButton />
      </section>
      <ResumeTemplate
        data={data}
        linkedinUrl={linkedinUrl}
        githubUrl={githubUrl}
        portfolioUrl={portfolioUrl}
        otherLinks={otherLinks}
      />
    </main>
  );
}
