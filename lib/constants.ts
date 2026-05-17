export const TECH_KEYWORDS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
  "Express", "MongoDB", "PostgreSQL", "MySQL", "SQL",
  "NoSQL", "Docker", "AWS", "GCP", "Azure",
  "CI/CD", "Tailwind CSS", "HTML", "CSS", "Git",
  "GitHub", "Socket.io", "Redux", "Prisma", "GraphQL",
  "Python", "Java", "C++", "REST API", "Firebase",
  "Redis", "Kubernetes", "Figma", "Sass", "Vue.js",
] as const;

export const SOFT_SKILLS = [
  "Leadership", "Communication", "Team Collaboration",
  "Problem Solving", "Time Management", "Adaptability",
  "Critical Thinking", "Creativity", "Work Ethic",
  "Attention to Detail", "Conflict Resolution", "Mentoring",
] as const;

export const JOB_ROLES = [
  { id: "frontend", label: "Frontend Dev", icon: "🎨" },
  { id: "backend", label: "Backend Dev", icon: "⚙️" },
  { id: "fullstack", label: "Full Stack", icon: "🚀" },
  { id: "uiux", label: "UI/UX Designer", icon: "✏️" },
  { id: "data", label: "Data / ML", icon: "📊" },
  { id: "other", label: "Other", icon: "💼" },
] as const;

export const EXPERIENCE_LEVELS = [
  { value: 0, label: "Fresher" },
  { value: 1, label: "1–2 yrs" },
  { value: 2, label: "2–4 yrs" },
  { value: 3, label: "4+ yrs" },
] as const;

export const EXPERIENCE_KEYWORDS = [
  "years", "experience", "2-5", "2", "3", "4", "5",
] as const;
