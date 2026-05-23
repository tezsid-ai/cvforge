import { NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";

type ChallengeBody = {
  challengeText: string;
};

const SYSTEM_PROMPT = `You are a professional resume writer. The user has described a professional challenge they solved. Structure it into exactly 3 parts:
Problem: (one sentence — what was the issue)
Action: (one to two sentences — what the user specifically did)
Result: (one sentence — measurable outcome if possible)
Return only these 3 lines prefixed with "Problem:", "Action:", "Result:". No extra text. No markdown.`;

function parseResponse(raw: string): {
  problem: string;
  action: string;
  result: string;
} {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  let problem = "";
  let action = "";
  let result = "";

  for (const line of lines) {
    if (/^problem:/i.test(line)) problem = line.replace(/^problem:\s*/i, "");
    else if (/^action:/i.test(line)) action = line.replace(/^action:\s*/i, "");
    else if (/^result:/i.test(line)) result = line.replace(/^result:\s*/i, "");
  }

  return { problem, action, result };
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
    const body = (await request.json()) as ChallengeBody;

    if (!body.challengeText?.trim()) {
      return NextResponse.json(
        { error: "Challenge text is required." },
        { status: 400 },
      );
    }

    const raw = await generateContent(body.challengeText, SYSTEM_PROMPT, false);
    const cleaned = stripFences(raw);
    const parsed = parseResponse(cleaned);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Challenge API error:", error);
    return NextResponse.json(
      { error: "Could not process the challenge." },
      { status: 500 },
    );
  }
}
