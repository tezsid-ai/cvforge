export async function enhanceAnswer(
  answer: string,
  field: string,
  jd: string,
): Promise<string> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer, field, jobDescription: jd || undefined }),
    });
    const data = (await res.json()) as { enhanced?: string };
    return data.enhanced ?? answer;
  } catch {
    return answer;
  }
}

export async function enhanceChallenge(text: string): Promise<string> {
  try {
    const res = await fetch("/api/challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeText: text }),
    });
    const data = (await res.json()) as {
      problem?: string;
      action?: string;
      result?: string;
    };
    if (data.problem) {
      return `Problem: ${data.problem}\nAction: ${data.action}\nResult: ${data.result}`;
    }
    return text;
  } catch {
    return text;
  }
}

export async function generateResume(
  resumeData: Record<string, string>,
  jd: string,
): Promise<string | null> {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeData, jobDescription: jd || undefined }),
    });
    const data = (await res.json()) as { finalResume?: string };
    return data.finalResume ?? null;
  } catch {
    return null;
  }
}

export type ParsedLinks = {
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  otherLinks: string[] | null;
};

export function parseChatLinks(rawLinks: string): ParsedLinks {
  let linkedinUrl: string | null = null;
  let githubUrl: string | null = null;
  let portfolioUrl: string | null = null;
  const otherLinks: string[] = [];

  if (rawLinks) {
    const urls = rawLinks
      .split(/[,;\s]+/)
      .map((u) => u.trim())
      .filter(Boolean);

    for (const u of urls) {
      const lower = u.toLowerCase();
      if (lower.includes("linkedin.com")) {
        linkedinUrl = u;
      } else if (lower.includes("github.com")) {
        githubUrl = u;
      } else if (
        lower.includes("portfolio") ||
        lower.includes("personal") ||
        lower.includes("website") ||
        /^https?:\/\//.test(u)
      ) {
        if (!portfolioUrl) portfolioUrl = u;
        else otherLinks.push(u);
      } else if (lower.includes(".")) {
        if (!portfolioUrl) portfolioUrl = u;
        else otherLinks.push(u);
      } else {
        otherLinks.push(u);
      }
    }
  }

  return {
    linkedinUrl,
    githubUrl,
    portfolioUrl,
    otherLinks: otherLinks.length > 0 ? otherLinks : null,
  };
}
