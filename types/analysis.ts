export type ImprovementItem = {
  original: string;
  improved: string;
  reason: string;
};

export type ExperienceInfo = {
  required: string;
  detected: number | null;
};

export type AnalysisResult = {
  matchScore: number;
  missingKeywords: string[];
  matchedKeywords?: string[];
  experience?: ExperienceInfo;
  improvements: ImprovementItem[];
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
