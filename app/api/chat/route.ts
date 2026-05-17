import { NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";

type EnhanceBody = {
  answer: string;
  field: string;
  jobDescription?: string;
};

function buildSystemPrompt(jd?: string): string {
  const base = `You are a professional resume writer. The user has answered a resume question casually. Enhance their answer into strong, professional, quantified resume language. Return only the enhanced text, no explanation.`;

  if (jd) {
    return `${base}\n\nAlso tailor this answer to match the following job description:\n${jd}`;
  }
  return base;
}

function stripFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json|text|plain)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as EnhanceBody;
    const { answer, field, jobDescription } = body;

    if (!answer?.trim()) {
      return NextResponse.json(
        { error: "Answer is required." },
        { status: 400 },
      );
    }

    const systemPrompt = buildSystemPrompt(jobDescription);
    const userPrompt = `Field: ${field}\nUser's answer: ${answer}`;
    const raw = await generateContent(userPrompt, systemPrompt, false);
    const enhanced = stripFences(raw);

    return NextResponse.json({ enhanced });
  } catch (error) {
    console.error("Chat enhance error:", error);
    return NextResponse.json(
      { error: "Could not enhance the answer right now." },
      { status: 500 },
    );
  }
}
