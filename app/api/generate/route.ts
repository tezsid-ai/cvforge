import { NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import { stripFences, buildFallbackResume } from "./helpers";

type GenerateBody = {
  resumeData: Record<string, string>;
  jobDescription?: string;
};

const SYSTEM_PROMPT = `You are a senior professional resume writer. Your job is to transform raw user-provided information into a polished, ATS-optimized resume.

CRITICAL RULES:
- Never output markdown syntax. No **, no *, no #, no backticks, no bullet dashes with spaces. Plain text only.
- Never dump the user's raw conversational answers. Always rewrite them into professional resume language.
- Never invent companies, roles, technologies, dates, or achievements not present in the input data.
- If a section has no data or the user wrote "None", skip that section entirely — do not render it.
- Never duplicate content across sections.

OUTPUT FORMAT — follow this exact structure:

[FULL NAME]
[email] | [phone] | [LinkedIn URL] | [GitHub URL] | [Portfolio URL]
(only include contact items that are actually provided — skip nulls)

SUMMARY
Write a 2-3 sentence professional summary based on the user's target role, experience level, and skills. Make it specific to their domain. Do not use generic filler phrases.

SKILLS
List skills as comma-separated values grouped by category. Example:
Languages: JavaScript, TypeScript, Python
Frameworks: React, Next.js, Express
Tools: Git, Docker, Figma
Databases: MongoDB, PostgreSQL
Do not write skills as a paragraph. Do not use bullet points for skills. Group them by category relevant to the user's domain.

EXPERIENCE
For each work experience or internship:
[Job Title] — [Company Name] | [Duration]
- [Strong action verb] + [what was done] + [outcome or impact if available]
- Maximum 3-4 bullet points per role
- Rewrite conversational input into professional language
- If no work experience exists, skip this section entirely

PROJECTS
For each project:
[Project Name] | [Tech Stack]
- [Strong action verb] + [what was built] + [key feature or outcome]
- Maximum 3 bullet points per project
- Rewrite conversational input into professional language
- Extract tech stack from user's answer even if mentioned casually

EDUCATION
[Degree], [Institution] | [Year]
[Secondary if provided]

ACHIEVEMENTS
Only include if user provided certifications, awards, hackathons, or leadership roles.
Skip entirely if empty or "None".

STRICT FORMATTING RULES:
- No markdown. No **bold**. No *italic*. No # headers. No backticks.
- Section headers must be in ALL CAPS on their own line.
- Bullet points use a simple dash: -
- One blank line between sections.
- No sub-headers like "Relevant Experience" or "Key Projects" — just the section name.
- No numbered lists anywhere.
- Skills must be comma-separated by category, never a paragraph.
- Return only the resume. No explanation, no preamble, no closing remarks.`;

const stripMarkdown = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')     // bold
    .replace(/\*(.*?)\*/g, '$1')          // italic
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // code
    .replace(/^#+\s/gm, '')              // headers
    .replace(/^>\s/gm, '')               // blockquotes
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // markdown links → plain text
    .trim();
};

export async function POST(request: Request): Promise<Response> {
  let resumeData: Record<string, string> | null = null;

  try {
    const body = (await request.json()) as GenerateBody;
    resumeData = body.resumeData;
    const { jobDescription } = body;

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
    const finalResume = stripMarkdown(stripFences(raw));

    if (!finalResume) {
      return NextResponse.json({
        finalResume: buildFallbackResume(resumeData),
      });
    }

    console.log("GENERATED RESUME:", finalResume.slice(0, 300));
    return NextResponse.json({ finalResume });
  } catch (error) {
    console.error("Generate error:", error);
    if (resumeData) {
      return NextResponse.json({
        finalResume: buildFallbackResume(resumeData),
      });
    }

    return NextResponse.json(
      { error: "Could not generate the resume right now." },
      { status: 500 },
    );
  }
}
