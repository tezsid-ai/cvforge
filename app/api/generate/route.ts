import { NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";

type GenerateBody = {
  resumeData: Record<string, string>;
  jobDescription?: string;
};

const SYSTEM_PROMPT = `You are a professional resume writer. Build a complete, well-structured resume using only the user's provided data. Return it as plain structured text with clear section headers.

Strict data rules:
- Do not invent technologies, tools, companies, degrees, dates, metrics, links, achievements, certifications, or experience.
- Use only details present in Resume Data.
- Use the Target Job Description only for tone and ordering. Do not add job-description skills to the resume unless the user also provided them in Resume Data.
- If a section has no user-provided data, do not show that section.
- If a field is vague, improve wording only from the given facts. Do not add new facts.

Use these sections in order only when they have data:
1. Full name and contact info at the top
2. Summary (1-2 sentences based only on provided role, experience, skills, education, or project data)
3. Skills (comma separated)
4. Experience (with bullet points only, no paragraphs)
5. Projects (with bullet points only, no paragraphs)
6. Education
7. Certifications or achievements, only if provided
8. How I Solved a Professional Challenge (Problem / Action / Result), only if provided

For Experience and Projects:
- Show a short title line first.
- Then add 3-5 bullet points.
- Every detail must be point-wise.
- Do not write theory-style paragraphs.
- Do not merge the whole project or experience into one paragraph.

No JSON. No markdown. No backticks. Just clean resume text with proper sections.`;

function stripFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json|text|plain)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();
}

function toBulletLines(value: string): string[] {
  return value
    .split(/\r?\n|(?<=\.)\s+(?=[A-Z])/)
    .map((item) => item.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 6)
    .map((item) => `- ${item}`);
}

function getSkills(resumeData: Record<string, string>): string {
  return (
    resumeData.techSkills ||
    resumeData.dataTools ||
    resumeData.devopsTools ||
    resumeData.testingTools ||
    resumeData.designTools ||
    resumeData.securityTools ||
    ""
  ).trim();
}

function buildSummary(resumeData: Record<string, string>): string {
  const parts: string[] = [];
  const role = resumeData.jobRole?.trim();
  const experience = resumeData.experience?.trim();
  const skills = getSkills(resumeData);

  if (role) parts.push(role);
  if (experience) parts.push(`${experience} experience`);
  if (skills) parts.push(`skilled in ${skills}`);

  return parts.length ? `${parts.join(" with ")}.` : "";
}

function buildFallbackResume(resumeData: Record<string, string>): string {
  const lines: string[] = [];
  const summary = buildSummary(resumeData);
  const skills = getSkills(resumeData);

  if (resumeData.name) lines.push(resumeData.name);
  if (resumeData.contact) lines.push(resumeData.contact);
  if (resumeData.location) lines.push(resumeData.location);
  if (resumeData.jobRole) lines.push(`Target Role: ${resumeData.jobRole}`);

  if (summary) {
    lines.push("");
    lines.push("SUMMARY");
    lines.push(summary);
  }

  if (skills) {
    lines.push("");
    lines.push("SKILLS");
    lines.push(skills);
  }

  if (resumeData.workExperience) {
    lines.push("");
    lines.push("EXPERIENCE");
    lines.push("Relevant Experience");
    lines.push(...toBulletLines(resumeData.workExperience));
  }

  if (resumeData.projects) {
    lines.push("");
    lines.push("PROJECTS");
    lines.push("Key Project");
    lines.push(...toBulletLines(resumeData.projects));
  }

  if (resumeData.education) {
    lines.push("");
    lines.push("EDUCATION");
    lines.push(resumeData.education);
  }

  if (resumeData.certifications) {
    lines.push("");
    lines.push("CERTIFICATIONS");
    lines.push(...toBulletLines(resumeData.certifications));
  }

  if (resumeData.challenge) {
    lines.push("");
    lines.push("HOW I SOLVED A PROFESSIONAL CHALLENGE");
    lines.push(...toBulletLines(resumeData.challenge));
  }

  return lines.join("\n").trim();
}

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
    const finalResume = stripFences(raw);

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
