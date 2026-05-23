export function stripFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json|text|plain)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();
}

export function toBulletLines(value: string): string[] {
  return value
    .split(/\r?\n|(?<=\.)\s+(?=[A-Z])/)
    .map((item) => item.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 6)
    .map((item) => `- ${item}`);
}

export function getSkills(resumeData: Record<string, string>): string {
  return (
    resumeData.techSkills ||
    resumeData.skills || // support new skills field format too
    resumeData.dataTools ||
    resumeData.devopsTools ||
    resumeData.testingTools ||
    resumeData.designTools ||
    resumeData.securityTools ||
    ""
  ).trim();
}

export function buildSummary(resumeData: Record<string, string>): string {
  const parts: string[] = [];
  const role = (resumeData.jobRole || resumeData.targetRole || "").trim();
  const experience = (resumeData.experience || resumeData.experienceLevel || "").trim();
  const skills = getSkills(resumeData);

  if (role) parts.push(role);
  if (experience) parts.push(`${experience} experience`);
  if (skills) parts.push(`skilled in ${skills}`);

  return parts.length ? `${parts.join(" with ")}.` : "";
}

export function buildFallbackResume(resumeData: Record<string, string>): string {
  const lines: string[] = [];
  const summary = buildSummary(resumeData);
  const skills = getSkills(resumeData);

  if (resumeData.name) lines.push(resumeData.name);
  if (resumeData.contact) lines.push(resumeData.contact);
  if (resumeData.location) lines.push(resumeData.location);
  
  const role = resumeData.jobRole || resumeData.targetRole;
  if (role) lines.push(`Target Role: ${role}`);

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

  if (resumeData.certifications || resumeData.achievements) {
    lines.push("");
    lines.push("ACHIEVEMENTS");
    lines.push(...toBulletLines(resumeData.certifications || resumeData.achievements));
  }

  if (resumeData.challenge) {
    lines.push("");
    lines.push("HOW I SOLVED A PROFESSIONAL CHALLENGE");
    lines.push(...toBulletLines(resumeData.challenge));
  }

  return lines.join("\n").trim();
}
