import { NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";

type ApplyImprovement = {
  original: string;
  improved: string;
};

type ApplyBody = {
  originalResume?: string;
  improvements?: ApplyImprovement[];
};

const SYSTEM_PROMPT = `You are an expert resume writer.

Your task is to rewrite the entire resume by applying the provided improvements.

Rules:
1. Replace weak bullet points with improved ones
2. Keep structure clean and professional
3. Do NOT remove important sections
4. Ensure consistency in tone
5. Make the resume concise and impactful

Return ONLY the final improved resume as plain structured text. No JSON. No markdown. No backticks. Just clean resume text with proper sections.`;

function stripCodeFences(text: string): string {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json|text|plain)?\s*/i, "");
  cleaned = cleaned.replace(/\s*```\s*$/, "");
  return cleaned.trim();
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as ApplyBody;
    const originalResume = body.originalResume?.trim();
    const improvements = body.improvements;

    if (!originalResume || !Array.isArray(improvements)) {
      return NextResponse.json(
        { error: "originalResume and improvements are required." },
        { status: 400 },
      );
    }

    const userPrompt = `Original Resume:\n${originalResume}\n\nImprovements:\n${JSON.stringify(improvements)}`;
    const raw = await generateContent(userPrompt, SYSTEM_PROMPT, false);
    const finalResume = stripCodeFences(raw);

    console.log("FINAL RESUME OUTPUT:", finalResume);

    return NextResponse.json({ finalResume });
  } catch (error) {
    console.error("Apply API error:", error);
    return NextResponse.json(
      { error: "Unable to apply resume improvements right now." },
      { status: 500 },
    );
  }
}
