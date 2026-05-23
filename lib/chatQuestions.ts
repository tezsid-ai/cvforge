export type QuestionType = "text" | "textarea" | "multiselect" | "select" | "experience";

export type Question = {
  id: string;
  type: QuestionType;
  label: string;
  options?: string[];
};

const ROLE_SKILLS: Record<string, string[]> = {
  "Full Stack": ["React", "Node.js", "TypeScript", "Next.js", "PostgreSQL", "Express", "Docker", "Git", "REST APIs", "AWS"],
  "Frontend": ["React", "TypeScript", "JavaScript", "HTML5/CSS3", "Tailwind CSS", "Next.js", "Vue.js", "Webpack", "Redux", "UI/UX Design"],
  "Backend": ["Node.js", "Python", "Go", "Java", "PostgreSQL", "MongoDB", "Express", "Docker", "REST APIs", "GraphQL"],
  "DevOps": ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "Jenkins", "Ansible", "Azure", "GCP"],
  "Designer": ["Figma", "UI Design", "UX Research", "Wireframing", "Prototyping", "Adobe Creative Suite", "Design Systems", "User Testing"],
  "Data": ["Python", "SQL", "Pandas", "NumPy", "Scikit-Learn", "TensorFlow", "PyTorch", "Tableau", "Power BI", "R"],
  "Marketing": ["SEO", "Google Analytics", "SEM", "Content Strategy", "Social Media Marketing", "Email Marketing", "Copywriting", "A/B Testing"],
  "Management": ["Agile Methodologies", "Scrum", "Project Management", "Jira", "Product Strategy", "Team Leadership", "Roadmapping", "Stakeholder Management"],
  "Other": ["Communication", "Problem Solving", "Teamwork", "Time Management", "Analytical Thinking", "Critical Thinking", "Adaptability", "Leadership"]
};

const ROLE_KEYWORDS: { role: string; keywords: string[] }[] = [
  { role: "Full Stack", keywords: ["fullstack", "full-stack", "full stack"] },
  { role: "Frontend", keywords: ["frontend", "front-end", "web developer", "react", "html", "css", "vue", "angular", "ui/ux"] },
  { role: "Backend", keywords: ["backend", "back-end", "node", "express", "django", "spring boot", "database", "api"] },
  { role: "DevOps", keywords: ["devops", "cloud", "aws", "kubernetes", "docker", "ci/cd", "terraform", "sre"] },
  { role: "Designer", keywords: ["designer", "design", "figma", "sketch", "photoshop", "ui", "ux", "wireframe"] },
  { role: "Data", keywords: ["data", "ml", "machine learning", "ai", "scientist", "analyst", "python", "sql", "tensorflow", "pytorch"] },
  { role: "Marketing", keywords: ["marketing", "seo", "sem", "social media", "growth", "copywriter"] },
  { role: "Management", keywords: ["management", "manager", "lead", "director", "scrum", "agile", "team lead"] }
];

function detectRole(jd: string): string {
  const text = jd.toLowerCase();
  for (const item of ROLE_KEYWORDS) {
    if (item.keywords.some(kw => text.includes(kw))) {
      return item.role;
    }
  }
  return "Other";
}

function extractSkills(jd: string, role: string): string[] {
  const text = jd.toLowerCase();
  const pool = ROLE_SKILLS[role] || ROLE_SKILLS["Other"];
  const matched = pool.filter(skill => text.includes(skill.toLowerCase()));
  const remaining = pool.filter(skill => !matched.includes(skill));
  const result = [...matched, ...remaining].slice(0, 8);
  return result;
}

export function buildWithJdQuestions(jobDescription: string): Question[] {
  const jd = jobDescription || "";
  const role = detectRole(jd);
  const skills = extractSkills(jd, role);

  const q9Label = jd.toLowerCase().includes("devops") || jd.toLowerCase().includes("cloud")
    ? "Which cloud platforms (AWS, Azure, GCP, etc.) have you worked with?"
    : jd.toLowerCase().includes("design")
    ? "Which design tools and process methods do you use?"
    : jd.toLowerCase().includes("data") || jd.toLowerCase().includes("ml")
    ? "Which models, datasets, or data tools have you worked with?"
    : jd.toLowerCase().includes("lead") || jd.toLowerCase().includes("manager") || jd.toLowerCase().includes("management")
    ? "What is the size of the team you managed?"
    : "Is there anything else you want highlighted in your resume?";

  return [
    { id: "name", type: "text", label: "What is your full name?" },
    { id: "contact", type: "text", label: "Your email and phone number?" },
    {
      id: "links",
      type: "text",
      label: "Paste your LinkedIn, GitHub, or Portfolio URL (or all, separated by comma)"
    },
    {
      id: "skills",
      type: "multiselect",
      label: "Which of these skills do you have?",
      options: skills
    },
    {
      id: "experienceLevel",
      type: "select",
      label: "What is your experience level?",
      options: ["Student / Fresher", "0-1 years", "1-3 years", "3-5 years", "5+ years"]
    },
    {
      id: "workExperience",
      type: "textarea",
      label: "Describe your most relevant work experience or internship. Include company, role, and what you built or achieved."
    },
    {
      id: "projects",
      type: "textarea",
      label: "List your top 2-3 projects. Include project name, tech stack, and key outcome for each."
    },
    {
      id: "education",
      type: "text",
      label: "Your highest qualification, institution, and year of passing/expected?"
    },
    {
      id: jd.toLowerCase().includes("devops") || jd.toLowerCase().includes("cloud") ? "cloudPlatforms"
        : jd.toLowerCase().includes("design") ? "designTools"
        : jd.toLowerCase().includes("data") || jd.toLowerCase().includes("ml") ? "dataML"
        : jd.toLowerCase().includes("lead") || jd.toLowerCase().includes("manager") || jd.toLowerCase().includes("management") ? "teamSize"
        : "highlighted",
      type: "textarea",
      label: q9Label
    }
  ];
}

export function buildWithoutJdQuestions(): Question[] {
  return [
    {
      id: "targetRole",
      type: "text",
      label: "What role or domain are you building this resume for? (e.g. Frontend Developer, UI/UX Designer, Data Analyst)"
    },
    { id: "name", type: "text", label: "What is your full name?" },
    { id: "contact", type: "text", label: "Your email and phone number?" },
    {
      id: "links",
      type: "text",
      label: "Paste your LinkedIn, GitHub, or Portfolio URL (or all, separated by comma)"
    },
    {
      id: "experienceLevel",
      type: "select",
      label: "What is your experience level?",
      options: ["Student / Fresher", "0-1 years", "1-3 years", "3-5 years", "5+ years"]
    },
    {
      id: "skills",
      type: "textarea",
      label: "List your top technical and soft skills relevant to your target role."
    },
    {
      id: "workExperience",
      type: "textarea",
      label: "Describe your most relevant work experience or internship. Include company, role, duration, and key achievements. Write 'None' if not applicable."
    },
    {
      id: "projects",
      type: "textarea",
      label: "List your top 2-3 projects. Include name, tech stack, and key outcome. These matter more than experience for freshers."
    },
    {
      id: "education",
      type: "text",
      label: "Your highest qualification, institution, and year of passing or expected graduation?"
    },
    {
      id: "achievements",
      type: "textarea",
      label: "Any certifications, awards, hackathons, open source contributions, or leadership roles? Write 'None' if not applicable."
    },
    {
      id: "summary",
      type: "textarea",
      label: "Write 2-3 sentences about yourself as a professional. This becomes your resume summary. (We will help improve it)"
    }
  ];
}
