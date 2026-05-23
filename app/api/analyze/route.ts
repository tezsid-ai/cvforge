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

const systemPrompt = `You are a senior ATS optimization expert and technical recruiter with 10+ years of experience.

You will receive a resume and a job description. Perform a deep analysis and return ONLY raw JSON with this exact structure:

{
  "matchScore": number (0-100, calculated as matched keywords / total JD keywords * 100),
  "atsVerdict": "string (1 sentence — should they apply or not, be honest and blunt)",
  "missingKeywords": ["keyword1", "keyword2"],
  "sectionScores": {
    "summary": number,
    "experience": number,
    "skills": number,
    "education": number
  },
  "weakPoints": [
    {
      "section": "Experience / Skills / Summary",
      "issue": "what is weak or misaligned",
      "fix": "specific actionable fix"
    }
  ],
  "interviewRisks": [
    "specific thing an interviewer would question or hesitate about"
  ],
  "reframingSuggestions": [
    {
      "current": "how experience is currently framed",
      "reframed": "how to reframe it to match what this JD is actually looking for"
    }
  ],
  "improvements": [
    {
      "original": "exact bullet point text from resume",
      "improved": "ATS-optimized rewritten version",
      "reason": "why this change improves ATS score and recruiter perception"
    }
  ],
  "recommendedAdditions": [
    {
      "type": "Project / Certification / Skill",
      "suggestion": "specific thing to add",
      "reason": "why it matters for this specific role"
    }
  ]
}

Rules:
- matchScore must use keyword frequency logic, not a guess
- atsVerdict must be blunt and honest, not encouraging
- improvements must be 4-6 items minimum
- weakPoints must be 3-5 items
- interviewRisks must be 2-4 items
- reframingSuggestions must be 2-3 items
- recommendedAdditions must be 3-5 items
- All analysis must be based strictly on the provided resume and JD — never assume or generalize
- Return ONLY the JSON. No markdown, no explanation, no code fences.`;

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
        {
          error:
            "Could not extract text from PDF. Make sure it is not a scanned image.",
        },
        { status: 400 },
      );
    }

    // URL extraction logic
    let decodedResumeText = resumeText;
    try {
      decodedResumeText = decodeURIComponent(resumeText);
    } catch {
      decodedResumeText = resumeText.replace(/%2f/gi, "/");
    }

    // 1. LinkedIn
    let linkedinUrl: string | null = null;
    const liMatch = decodedResumeText.match(
      /linkedin\.com\/in\/([a-zA-Z0-9\-]+)/i,
    );
    if (liMatch && liMatch[1]) {
      let username = liMatch[1].replace(/\/+$/, "");
      if (username.includes("?")) {
        username = username.split("?")[0];
      }
      if (username.length >= 2) {
        linkedinUrl = `https://linkedin.com/in/${username}`;
      }
    }

    if (!linkedinUrl) {
      const liAltMatch = decodedResumeText.match(
        /LinkedIn[:\s]+([a-zA-Z0-9\-]+)/i,
      );
      if (liAltMatch && liAltMatch[1]) {
        let username = liAltMatch[1].replace(/\/+$/, "");
        if (username.includes("?")) {
          username = username.split("?")[0];
        }
        if (username.length >= 2) {
          linkedinUrl = `https://linkedin.com/in/${username}`;
        }
      }
    }

    // 2. GitHub
    let githubUrl: string | null = null;
    const ghMatch = decodedResumeText.match(/github\.com\/([a-zA-Z0-9\-]+)/i);
    if (ghMatch && ghMatch[1]) {
      let username = ghMatch[1].replace(/\/+$/, "");
      if (username.includes("?")) {
        username = username.split("?")[0];
      }
      if (username.length >= 2) {
        githubUrl = `https://github.com/${username}`;
      }
    }

    if (!githubUrl) {
      const ghAltMatch = decodedResumeText.match(
        /GitHub[:\s]+([a-zA-Z0-9\-]+)/i,
      );
      if (ghAltMatch && ghAltMatch[1]) {
        let username = ghAltMatch[1].replace(/\/+$/, "");
        if (username.includes("?")) {
          username = username.split("?")[0];
        }
        if (username.length >= 2) {
          githubUrl = `https://github.com/${username}`;
        }
      }
    }

    // 3. Portfolio
    let portfolioUrl: string | null = null;
    const portfolioPattern1 =
      /https?:\/\/(?!linkedin|github)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}[^\s]*/gi;
    const matches1 = decodedResumeText.match(portfolioPattern1);
    let firstMatch: string | null = null;
    if (matches1 && matches1.length > 0) {
      firstMatch = matches1[0];
    } else {
      const portfolioPattern2 =
        /(?<![\/\w])([a-zA-Z0-9\-]+\.(in|com|dev|io|me|co)[^\s,]*)/gi;
      const matches2 = decodedResumeText.match(portfolioPattern2);
      if (matches2) {
        for (const match of matches2) {
          if (!/linkedin\.com/i.test(match) && !/github\.com/i.test(match)) {
            firstMatch = match;
            break;
          }
        }
      }
    }

    if (firstMatch) {
      let cleaned = firstMatch.replace(/\/+$/, "");
      if (cleaned.includes("?")) {
        cleaned = cleaned.split("?")[0];
      }
      if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
        portfolioUrl = `https://${cleaned}`;
      } else {
        portfolioUrl = cleaned;
      }
    }

    // 4. Other links
    const allUrls: string[] = [];
    const generalUrlRegex1 =
      /https?:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}[^\s]*/gi;
    const genMatches1 = decodedResumeText.match(generalUrlRegex1);
    if (genMatches1) {
      for (const m of genMatches1) {
        allUrls.push(m);
      }
    }

    const generalUrlRegex2 =
      /(?<![\/\w])([a-zA-Z0-9\-]+\.(in|com|dev|io|me|co)[^\s,]*)/gi;
    const genMatches2 = decodedResumeText.match(generalUrlRegex2);
    if (genMatches2) {
      for (const m of genMatches2) {
        allUrls.push(m);
      }
    }

    const cleanedUrls: string[] = [];
    const normalizedCaptured: string[] = [];
    if (linkedinUrl) normalizedCaptured.push(linkedinUrl.toLowerCase());
    if (githubUrl) normalizedCaptured.push(githubUrl.toLowerCase());
    if (portfolioUrl) normalizedCaptured.push(portfolioUrl.toLowerCase());

    for (const url of allUrls) {
      let cleaned = url.replace(/\/+$/, "");
      if (cleaned.includes("?")) {
        cleaned = cleaned.split("?")[0];
      }
      if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
        cleaned = `https://${cleaned}`;
      }

      const lower = cleaned.toLowerCase();
      const isAlreadyCaptured = normalizedCaptured.some(
        (cap) => lower.includes(cap) || cap.includes(lower),
      );
      if (!isAlreadyCaptured && !cleanedUrls.includes(cleaned)) {
        if (!/linkedin\.com/i.test(cleaned) && !/github\.com/i.test(cleaned)) {
          cleanedUrls.push(cleaned);
        }
      }
    }

    const otherLinks: string[] | null =
      cleanedUrls.slice(0, 3).length > 0 ? cleanedUrls.slice(0, 3) : null;

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
    const allMatched = [
      ...new Set([...(parsed.matchedKeywords ?? []), ...matched]),
    ];

    return NextResponse.json({
      ...parsed,
      missingKeywords: allMissing,
      matchedKeywords: allMatched,
      resumeText,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      otherLinks,
    });
  } catch (err) {
    console.error("Analyze error:", err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 },
    );
  }
}
