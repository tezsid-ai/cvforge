import type { ResumeData } from "@/types/resume";
import {
  mergeContactLines,
  parseChallenge,
  parseEducationEntries,
  parseExperience,
  parseProjects,
  parseSkillLines,
} from "./parseHelpers";

/** Known section header names (case-insensitive exact match) */
const SECTION_NAMES = new Set([
  "skills",
  "experience",
  "projects",
  "education",
  "summary",
  "challenge",
]);

/** Multi-word headers matched with startsWith */
const SECTION_PREFIXES = ["how i solved"];

function isSectionHeader(line: string): boolean {
  const t = line
    .trim()
    .toLowerCase()
    .replace(/:+\s*$/, "");
  if (SECTION_NAMES.has(t)) return true;
  return SECTION_PREFIXES.some((p) => t === p || t.startsWith(`${p} `));
}

function normalizeSectionName(line: string): string {
  return line
    .trim()
    .toLowerCase()
    .replace(/:+\s*$/, "");
}

export type ResumeSection = {
  heading: string;
  lines: string[];
};

/** Split raw text into named sections */
export function parseResumeSections(content: string): ResumeSection[] {
  const rawLines = content.split(/\r?\n/);
  const sections: ResumeSection[] = [];
  let current: ResumeSection | null = null;

  for (const line of rawLines) {
    if (isSectionHeader(line)) {
      if (current) sections.push(current);
      current = { heading: normalizeSectionName(line), lines: [] };
    } else {
      if (!current) current = { heading: "", lines: [] };
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

const EMPTY_RESUME: ResumeData = {
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

export function parseResumeText(text: string): ResumeData {
  if (!text || !text.trim()) {
    console.warn("[parseResumeText] Empty input, returning placeholder");
    return { ...EMPTY_RESUME };
  }

  const allLines = text.split(/\r?\n/);
  const nonEmptyLines = allLines.map((l) => l.trim()).filter(Boolean);

  // NAME — first non-empty line
  const name = nonEmptyLines[0] ?? "";

  // CONTACT - top lines before the first section may include email/phone/links
  const firstSectionIndex = nonEmptyLines.findIndex(isSectionHeader);
  const headerLines =
    firstSectionIndex === -1
      ? nonEmptyLines.slice(1, 5)
      : nonEmptyLines.slice(1, firstSectionIndex);
  const contact = mergeContactLines(headerLines);

  // Parse the rest into sections
  const sections = parseResumeSections(text);

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

  for (const s of sections) {
    const h = s.heading;
    const lines = s.lines.filter((l) => l.trim());

    if (h.startsWith("summary")) {
      data.summary = lines.join(" ");
    } else if (h.startsWith("skill")) {
      data.skills = parseSkillLines(lines);
    } else if (h.startsWith("experience")) {
      data.experience = parseExperience(s.lines);
    } else if (h.startsWith("project")) {
      data.projects = parseProjects(s.lines);
    } else if (h.startsWith("education")) {
      data.education = parseEducationEntries(s.lines);
    } else if (h.startsWith("how i solved") || h.startsWith("challenge")) {
      data.challenge = parseChallenge(s.lines);
    }
  }

  console.log(
    "[parseResumeText] PARSED RESUME:",
    JSON.stringify(data, null, 2),
  );
  return data;
}
