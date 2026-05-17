import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import { extractKeywordsFromJD, matchKeywords } from "@/lib/keywordMatcher";
import PDFParser from "pdf2json";

async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser(null, true);
    parser.on("pdfParser_dataError", (err: { parserError: string }) => {
      reject(new Error(err.parserError));
    });
    parser.on("pdfParser_dataReady", () => {
      const text = (parser as any).getRawTextContent();
      resolve(text?.trim() ?? "");
    });
    parser.parseBuffer(buffer);
  });
}

const systemPrompt = `You are a professional ATS and resume expert.
Extract ALL required skills and keywords from the job description.
Check which keywords are PRESENT in the resume (flexible matching: ReactJS = React).
Calculate matchScore as: (matched / total JD keywords) * 100, rounded to integer.
Identify 3-5 weak bullet points and suggest improved versions.
Return ONLY raw JSON, no markdown, no explanation:
{
  "matchScore": number,
  "missingKeywords": ["keyword1", "keyword2"],
  "improvements": [
    {
      "original": "exact text from resume",
      "improved": "stronger rewritten version",
      "reason": "why this is better"
    }
  ]
}`;

function extractJSON(raw: string): string {
  const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : raw.trim();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
    const jobDescription = formData.get("jobDescription") as string;

    if (!file || !jobDescription) {
      return NextResponse.json(
        { error: "Missing resume or job description" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const resumeText = await parsePdfBuffer(buffer);

    if (!resumeText || resumeText.length < 20) {
      return NextResponse.json(
        { error: "Could not extract text from PDF. Make sure it is not a scanned image." },
        { status: 400 },
      );
    }

    // AI analysis
    const userPrompt = `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`;
    const raw = await generateContent(userPrompt, systemPrompt, true);
    const cleaned = extractJSON(raw);
    const parsed = JSON.parse(cleaned);

    // Deterministic keyword matching
    const jdKeywords = extractKeywordsFromJD(jobDescription);
    const { matched, missing } = matchKeywords(resumeText, jdKeywords);

    // Merge: combine AI keywords with deterministic ones (deduplication)
    const aiMissing: string[] = parsed.missingKeywords ?? [];
    const allMissing = [...new Set([...aiMissing, ...missing])];
    const allMatched = [...new Set([...(parsed.matchedKeywords ?? []), ...matched])];

    return NextResponse.json({
      ...parsed,
      missingKeywords: allMissing,
      matchedKeywords: allMatched,
      resumeText,
    });
  } catch (err) {
    console.error("Analyze error:", err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 },
    );
  }
}
