import type {
  ContactInfo,
  ExperienceEntry,
  EducationEntry,
  ProjectEntry,
  ChallengeSection,
} from "@/types/resume";

/** Parse pipe-separated contact line */
export function parseContactLine(line: string): ContactInfo {
  const c: ContactInfo = { email: "", phone: "", linkedin: "", github: "", website: "" };
  const parts = line.split("|").map((p) => p.trim());

  for (const part of parts) {
    if (part.includes("@")) {
      c.email = part.trim();
    } else if (/LinkedIn:\s*/i.test(part)) {
      c.linkedin = part.replace(/LinkedIn:\s*/i, "").trim();
    } else if (/GitHub:\s*/i.test(part)) {
      c.github = part.replace(/GitHub:\s*/i, "").trim();
    } else if (/^https?:\/\/|^www\./i.test(part)) {
      c.website = part.trim();
    } else if (/[\d()+-]{7,}/.test(part)) {
      c.phone = part.trim();
    }
  }
  return c;
}

/** Extract skills from lines like "Technical Stack: React, Node.js" */
export function parseSkillLines(lines: string[]): string[] {
  const skills: string[] = [];
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx !== -1) {
      const after = line.slice(colonIdx + 1).trim();
      const items = after.split(/[,;|]/).map((s) => s.trim()).filter(Boolean);
      skills.push(...items);
    } else {
      const trimmed = line.trim();
      if (trimmed) {
        const items = trimmed.split(/[,;|]/).map((s) => s.trim()).filter(Boolean);
        skills.push(...items);
      }
    }
  }
  return skills;
}

const DATE_RE = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4}/i;

/** Parse experience blocks: title – company | duration, then bullet lines */
export function parseExperience(lines: string[]): ExperienceEntry[] {
  const entries: ExperienceEntry[] = [];
  let cur: ExperienceEntry | null = null;

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;

    if (DATE_RE.test(t)) {
      if (cur) entries.push(cur);
      const [titlePart = "", durationPart = ""] = t.split(/\|/).map((s) => s.trim());
      const dashSplit = titlePart.split(/\s[–—-]\s/);
      cur = {
        title: dashSplit[0]?.trim() ?? "",
        company: dashSplit[1]?.trim() ?? "",
        duration: durationPart || "",
        bullets: [],
      };
    } else if (/^\s*[*\-•]/.test(line) && cur) {
      cur.bullets.push(t.replace(/^[*\-•]\s*/, ""));
    } else if (cur && cur.bullets.length === 0 && !cur.company) {
      cur.company = t;
    }
  }
  if (cur) entries.push(cur);
  return entries;
}

/** Parse project blocks: name — techStack, then bullet lines */
export function parseProjects(lines: string[]): ProjectEntry[] {
  const entries: ProjectEntry[] = [];
  let cur: ProjectEntry | null = null;

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;

    if (/^\s*[*\-•]/.test(line) && cur) {
      cur.bullets.push(t.replace(/^[*\-•]\s*/, ""));
    } else {
      if (cur) entries.push(cur);
      const parts = t.split(/\s[—|]\s/);
      cur = {
        name: parts[0]?.trim() ?? t,
        techStack: parts[1]?.trim() ?? "",
        bullets: [],
      };
    }
  }
  if (cur) entries.push(cur);
  return entries;
}

/** Parse education blocks: institution, then indented degree/grade lines */
export function parseEducationEntries(lines: string[]): EducationEntry[] {
  const entries: EducationEntry[] = [];
  let cur: EducationEntry | null = null;

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;

    const isIndented = line.startsWith("  ") || line.startsWith("\t");

    if (!isIndented && t.length > 3) {
      if (cur) entries.push(cur);
      const datePart = t.match(DATE_RE);
      cur = { institution: t.replace(DATE_RE, "").replace(/\|/g, "").trim(), degree: "", duration: datePart?.[0] ?? "", grade: "" };
    } else if (cur) {
      if (/grade|cgpa|gpa|percentage/i.test(t)) {
        cur.grade = t;
      } else if (DATE_RE.test(t)) {
        cur.duration = t;
      } else {
        cur.degree = cur.degree ? `${cur.degree}, ${t}` : t;
      }
    }
  }
  if (cur) entries.push(cur);
  return entries;
}

/** Parse challenge block into problem/action/result */
export function parseChallenge(lines: string[]): ChallengeSection | null {
  let problem = "";
  let action = "";
  let result = "";
  for (const l of lines) {
    const t = l.trim();
    if (/^(🔴\s*)?problem/i.test(t)) problem = t.replace(/^(🔴\s*)?problem\s*:\s*/i, "");
    else if (/^(🔧\s*)?action/i.test(t)) action = t.replace(/^(🔧\s*)?action\s*:\s*/i, "");
    else if (/^(✅\s*)?result/i.test(t)) result = t.replace(/^(✅\s*)?result\s*:\s*/i, "");
  }
  if (!problem && !action && !result) return null;
  return { problem, action, result };
}
