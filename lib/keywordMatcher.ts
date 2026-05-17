import { EXPERIENCE_KEYWORDS, TECH_KEYWORDS } from "@/lib/constants";

const keywordMap: Record<string, string[]> = {
  react: ["react", "reactjs"],
  nextjs: ["nextjs", "next"],
  node: ["node", "nodejs"],
  mongodb: ["mongodb", "mongo"],
  postgresql: ["postgresql", "postgres"],
  socketio: ["socketio", "socket"],
};

const coreKeywords = new Set([
  "react",
  "node",
  "nextjs",
  "typescript",
  "javascript",
]);
const dbKeywords = new Set(["mongodb", "postgresql", "sql", "nosql", "prisma"]);

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toCanonical(keyword: string): string {
  const normalized = normalizeText(keyword);
  if (normalized === "next" || normalized === "nextjs") {
    return "nextjs";
  }
  if (normalized === "reactjs") {
    return "react";
  }
  if (normalized === "nodejs") {
    return "node";
  }
  if (normalized === "postgres") {
    return "postgresql";
  }
  if (normalized === "socket" || normalized === "socketio") {
    return "socketio";
  }
  return normalized;
}

export function extractKeywordsFromJD(jd: string): string[] {
  const normalizedJD = normalizeText(jd);
  const seen = new Set<string>();
  for (const keyword of TECH_KEYWORDS) {
    const canonical = toCanonical(keyword);
    const variations = keywordMap[canonical] ?? [canonical];
    const found = variations.some((variation) =>
      normalizedJD.includes(normalizeText(variation)),
    );
    if (found) {
      seen.add(canonical);
    }
  }

  return [...seen].slice(0, 40);
}

export function matchKeywords(
  resume: string,
  keywords: string[],
): { matched: string[]; missing: string[] } {
  if (!resume || resume.trim().length < 20) {
    throw new Error("Resume text is empty or invalid");
  }

  const normalizedResume = normalizeText(resume);
  const scopedKeywords = [...new Set(keywords.map(toCanonical))].filter(
    (keyword) => TECH_KEYWORDS.some((item) => toCanonical(item) === keyword),
  );
  const matched: string[] = [];
  const missing: string[] = [];

  for (const keyword of scopedKeywords) {
    const variations = keywordMap[keyword] ?? [keyword];
    const isMatch = variations.some((variation) =>
      normalizedResume.includes(normalizeText(variation)),
    );

    console.log({ normalizedResume, keyword, variations, matched: isMatch });

    if (isMatch) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  }

  return { matched, missing };
}

function getKeywordWeight(keyword: string): number {
  if (coreKeywords.has(keyword)) {
    return 3;
  }
  if (dbKeywords.has(keyword)) {
    return 2;
  }
  return 1;
}

export function calculateScore(
  matched: string[],
  allKeywords: string[],
): number {
  if (allKeywords.length === 0) {
    return 0;
  }

  const matchedSet = new Set(matched);
  let weightedTotal = 0;
  let weightedMatched = 0;
  for (const keyword of allKeywords) {
    const weight = getKeywordWeight(keyword);
    weightedTotal += weight;
    if (matchedSet.has(keyword)) {
      weightedMatched += weight;
    }
  }

  if (weightedTotal === 0) {
    return 0;
  }

  return Math.round((weightedMatched / weightedTotal) * 100);
}

export function extractExperienceRange(jd: string): {
  minExp: number | null;
  maxExp: number | null;
  required: string;
} {
  const normalizedJD = normalizeText(jd);
  const rangeMatch = normalizedJD.match(/(\d+)\s*-\s*(\d+)\s*years/);
  if (rangeMatch) {
    return {
      minExp: Number(rangeMatch[1]),
      maxExp: Number(rangeMatch[2]),
      required: `${rangeMatch[1]}-${rangeMatch[2]}`,
    };
  }

  const singleMatch = normalizedJD.match(/(\d+)\s*years/);
  if (singleMatch) {
    return {
      minExp: Number(singleMatch[1]),
      maxExp: Number(singleMatch[1]),
      required: singleMatch[1],
    };
  }

  const fallback = EXPERIENCE_KEYWORDS.find((item) =>
    normalizedJD.includes(item),
  );
  return { minExp: null, maxExp: null, required: fallback ?? "" };
}

export function detectResumeExperience(resume: string): number | null {
  const normalizedResume = normalizeText(resume);
  const range = normalizedResume.match(/(\d+)\s*-\s*(\d+)\s*years/);
  if (range) {
    return Number(range[2]);
  }

  const single = normalizedResume.match(/(\d+)\s*years/);
  return single ? Number(single[1]) : null;
}
