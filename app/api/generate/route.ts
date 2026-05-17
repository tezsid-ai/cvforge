import { NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";

type GenerateBody = {
  resumeData: Record<string, string>;
  jobDescription?: string;
};

const SYSTEM_PROMPT = `You are a professional resume writer. Build a complete, well-structured resume using the following data. Return it as plain structured text with clear section headers.

Include these sections in order:
1. Full name and contact info at the top
2. Summary (2-3 sentences)
3. Skills (comma separated)
4. Experience (with bullet points)
5. Projects (with bullet points)
6. Education
7. How I Solved a Professional Challenge (Problem / Action / Result)

No JSON. No markdown. No backticks. Just clean resume text with proper sections.`;

function stripFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json|text|plain)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as GenerateBody;
    const { resumeData, jobDescription } = body;

    if (!resumeData) {
      return NextResponse.json(
        { error: "Resume data is required." },
        { status: 400 },
      );
    }

    let prompt = `Resume Data:\n${JSON.stringify(resumeData, null, 2)}`;
    if (jobDescription) {
      prompt += `\n\nTarget Job Description:\n${jobDescription}`;
    }

    const raw = await generateContent(prompt, SYSTEM_PROMPT, false);
    const finalResume = stripFences(raw);

    console.log("GENERATED RESUME:", finalResume.slice(0, 300));

    return NextResponse.json({ finalResume });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Could not generate the resume right now." },
      { status: 500 },
    );
  }
}
