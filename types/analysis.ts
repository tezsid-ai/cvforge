export type ImprovementItem = {
  original: string;
  improved: string;
  reason: string;
};

export type ExperienceInfo = {
  required: string;
  detected: number | null;
};

export type WeakPoint = {
  section: string;
  issue: string;
  fix: string;
};

export type ReframingSuggestion = {
  current: string;
  reframed: string;
};

export type RecommendedAddition = {
  type: string;
  suggestion: string;
  reason: string;
};

export type SectionScores = {
  summary: number;
  experience: number;
  skills: number;
  education: number;
};

export type AnalysisResult = {
  matchScore: number;
  atsVerdict?: string;
  missingKeywords: string[];
  matchedKeywords?: string[];
  experience?: ExperienceInfo;
  sectionScores?: SectionScores;
  weakPoints?: WeakPoint[];
  interviewRisks?: string[];
  reframingSuggestions?: ReframingSuggestion[];
  improvements: ImprovementItem[];
  recommendedAdditions?: RecommendedAddition[];
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  otherLinks?: string[] | null;
};

export function isAnalysisResult(value: unknown): value is AnalysisResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<AnalysisResult>;
  const hasValidOptionalMatched =
    candidate.matchedKeywords === undefined ||
    Array.isArray(candidate.matchedKeywords);
  const hasValidOptionalExperience =
    candidate.experience === undefined ||
    (typeof candidate.experience.required === "string" &&
      (typeof candidate.experience.detected === "number" ||
        candidate.experience.detected === null));

  return (
    typeof candidate.matchScore === "number" &&
    Array.isArray(candidate.missingKeywords) &&
    Array.isArray(candidate.improvements) &&
    hasValidOptionalMatched &&
    hasValidOptionalExperience
  );
}
