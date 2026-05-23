export function isEmptyOrNone(val: any): boolean {
  if (val === null || val === undefined) return true;
  if (typeof val === "string") {
    const t = val.trim();
    return t === "" || t.toLowerCase() === "none";
  }
  if (Array.isArray(val)) {
    return val.length === 0 || val.every(isEmptyOrNone);
  }
  return false;
}

export function getHumanLabel(url: string): string {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.hostname.replace("www.", "");
  } catch {
    return url.replace(/^https?:\/\/(www\.)?/, "");
  }
}

export function getGroupedSkills(raw: string | null): string[] {
  if (!raw) return [];
  const lines = raw.split(/\r?\n/);
  const res: string[] = [];
  let active = false;
  for (const line of lines) {
    const t = line.trim();
    if (active) {
      if (t === "") continue;
      if (/^[A-Z]{3,}(\s+[A-Z]{3,})*$/.test(t) && t !== "SKILLS") break;
      res.push(t);
    } else if (t.toUpperCase() === "SKILLS") {
      active = true;
    }
  }
  return res;
}

export function getAchievements(raw: string | null): string[] {
  if (!raw) return [];
  const lines = raw.split(/\r?\n/);
  const res: string[] = [];
  let active = false;
  for (const line of lines) {
    const t = line.trim();
    if (active) {
      if (t === "") continue;
      if (/^[A-Z]{3,}(\s+[A-Z]{3,})*$/.test(t) && t !== "ACHIEVEMENTS") break;
      res.push(t.replace(/^[-*\u2022]\s*/, ""));
    } else if (t.toUpperCase() === "ACHIEVEMENTS") {
      active = true;
    }
  }
  return res;
}
