"use client";

import { useEffect, useState } from "react";
import DownloadButton from "@/components/preview/DownloadButton";
import ResumeTemplate from "@/components/preview/ResumeTemplate";
import BackButton from "@/components/ui/BackButton";
import {
  mergeContactLines,
  parseChallenge,
  parseEducationEntries,
  parseSkillLines,
} from "@/lib/parseHelpers";
import type { ExperienceEntry, ProjectEntry, ResumeData } from "@/types/resume";

type PageState = "loading" | "empty" | "ready";

const HEADERS = [
  "SUMMARY",
  "SKILLS",
  "EXPERIENCE",
  "PROJECTS",
  "EDUCATION",
  "ACHIEVEMENTS",
  "CHALLENGE",
];

function cleanContactValue(val: string): string {
  let v = val.trim();
  v = v.replace(
    /^(?:linkedin|github|portfolio|website|phone|email)\s*:?\s*/i,
    "",
  );
  return v.trim();
}

function isValidPortfolio(url: string | null | undefined): boolean {
  if (!url) return false;
  const normalized = url.toLowerCase();
  const blacklisted = ["gmail.com", "google.com", "linkedin.com", "github.com"];
  return !blacklisted.some((domain) => normalized.includes(domain));
}

function isDateLine(line: string): boolean {
  const t = line.trim();
  const hasYear = /\b(19|20)\d{2}\b/.test(t);
  const hasPresent = /\b(present|current|ongoing)\b/i.test(t);
  return t.length < 35 && (hasYear || hasPresent);
}

function parseCustomExperience(lines: string[]): ExperienceEntry[] {
  const entries: ExperienceEntry[] = [];
  let cur: ExperienceEntry | null = null;

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;

    if (/^\s*[-*\u2022]/.test(line)) {
      if (!cur) {
        cur = {
          title: "Relevant Experience",
          company: "",
          duration: "",
          bullets: [],
        };
      }
      cur.bullets.push(t.replace(/^\s*[-*\u2022]\s*/, "").trim());
      continue;
    }

    if (isDateLine(t)) {
      if (cur) {
        cur.duration = t;
      }
      continue;
    }

    if (cur) {
      entries.push(cur);
    }

    const parts = t.split("|").map((s) => s.trim());
    const titlePart = parts[0] || t;
    const secondPart = parts[1] || "";

    cur = {
      title: titlePart,
      company: secondPart,
      duration: "",
      bullets: [],
    };
  }

  if (cur) {
    entries.push(cur);
  }
  return entries;
}

function parseCustomProjects(lines: string[]): ProjectEntry[] {
  const entries: ProjectEntry[] = [];
  let cur: (ProjectEntry & { duration?: string }) | null = null;

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;

    if (/^\s*[-*\u2022]/.test(line)) {
      if (!cur) {
        cur = { name: "Project", techStack: "", bullets: [] };
      }
      cur.bullets.push(t.replace(/^\s*[-*\u2022]\s*/, "").trim());
      continue;
    }

    if (isDateLine(t)) {
      if (cur) {
        cur.duration = t;
      }
      continue;
    }

    if (cur) {
      entries.push(cur);
    }

    const parts = t.split("|").map((s) => s.trim());
    const namePart = parts[0] || t;
    const techStackPart = parts[1] || "";

    cur = {
      name: namePart,
      techStack: techStackPart,
      bullets: [],
    };
  }

  if (cur) {
    entries.push(cur);
  }
  return entries;
}

function cleanRawTextHeaders(text: string): string {
  const lines = text.split(/\r?\n/);
  const cleanedLines = lines.map((line) => {
    const trimmed = line.trim();
    const clean = trimmed
      .replace(/[*#:_]/g, "")
      .trim()
      .toUpperCase();
    if (HEADERS.includes(clean)) {
      return clean;
    }
    if (clean.startsWith("HOW I SOLVED")) {
      return "CHALLENGE";
    }
    return line;
  });
  return cleanedLines.join("\n");
}

function parseResumeText(text: string): ResumeData {
  if (!text || !text.trim()) {
    return {
      name: "(Name not found)",
      jobTitle: "",
      contact: { email: "", phone: "", linkedin: "", github: "", website: "" },
      summary: "No resume content could be parsed.",
      experience: [],
      education: [],
      skills: [],
      projects: [],
      challenge: null,
    };
  }

  const lines = text.split(/\r?\n/);
  const nonEmptyLines = lines.map((l) => l.trim()).filter(Boolean);

  const name = nonEmptyLines[0] ?? "(Name not found)";

  type Section = {
    header: string;
    lines: string[];
  };

  const sections: Section[] = [];
  let currentHeader = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const clean = trimmed
      .replace(/[*#:_]/g, "")
      .trim()
      .toUpperCase();

    let isHeader = HEADERS.includes(clean);
    let matchedHeader = clean;
    if (clean.startsWith("HOW I SOLVED")) {
      isHeader = true;
      matchedHeader = "CHALLENGE";
    }

    if (isHeader) {
      if (currentLines.length > 0 || currentHeader !== "") {
        sections.push({ header: currentHeader, lines: currentLines });
      }
      currentHeader = matchedHeader;
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }
  if (currentLines.length > 0 || currentHeader !== "") {
    sections.push({ header: currentHeader, lines: currentLines });
  }

  const preHeaderSection = sections.find((s) => s.header === "");
  const contactLines = preHeaderSection
    ? preHeaderSection.lines.map((l) => l.trim()).filter((l) => l && l !== name)
    : [];
  const contact = mergeContactLines(contactLines);

  // Clean contact prefixes so only clean URLs are saved and rendered as <a> links
  contact.linkedin = cleanContactValue(contact.linkedin);
  contact.github = cleanContactValue(contact.github);
  contact.website = cleanContactValue(contact.website);

  // Validate parsed website to exclude blacklisted domains
  if (!isValidPortfolio(contact.website)) {
    contact.website = "";
  }

  const data: ResumeData = {
    name,
    jobTitle: "",
    contact,
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    challenge: null,
  };

  const isNoneOrEmpty = (val: string) => {
    const trimmed = val.trim();
    return !trimmed || trimmed.toLowerCase() === "none";
  };

  for (const s of sections) {
    const h = s.header;
    const sLines = s.lines.filter((l) => l.trim());
    if (sLines.length === 0) continue;

    if (sLines.length === 1 && isNoneOrEmpty(sLines[0])) {
      continue;
    }

    if (h === "SUMMARY") {
      // Capture everything between the SUMMARY header and the next ALL CAPS section header as the summary text
      const summaryVal = s.lines
        .map((l) => l.trim())
        .filter(Boolean)
        .join(" ");
      data.summary = isNoneOrEmpty(summaryVal) ? "" : summaryVal;
    } else if (h === "SKILLS") {
      data.skills = parseSkillLines(sLines);
    } else if (h === "EXPERIENCE") {
      data.experience = parseCustomExperience(s.lines);
    } else if (h === "PROJECTS") {
      data.projects = parseCustomProjects(s.lines);
    } else if (h === "EDUCATION") {
      data.education = parseEducationEntries(s.lines);
    } else if (h === "CHALLENGE") {
      data.challenge = parseChallenge(s.lines);
    }
  }

  return data;
}

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
        if (parsed.portfolioUrl && isValidPortfolio(parsed.portfolioUrl)) {
          setPortfolioUrl(parsed.portfolioUrl);
        } else {
          setPortfolioUrl(null);
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

    // Clean raw text headers to prevent twice-rendering under getGroupedSkills
    const cleanedRaw = cleanRawTextHeaders(raw);
    sessionStorage.setItem("finalResume", cleanedRaw);

    const resolved = resolveResumeData(cleanedRaw);
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
