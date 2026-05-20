export type QuestionType =
  | "text"
  | "contact"
  | "role"
  | "experience"
  | "techSkills"
  | "softSkills"
  | "project"
  | "textarea";

export type ChatQuestion = {
  id: string;
  question: string;
  type: QuestionType;
  field: string;
  meta?: {
    showGithub?: boolean;
    showLinkedin?: boolean;
  };
};

export type RoleBucket =
  | "software"
  | "data"
  | "devops"
  | "qa"
  | "design"
  | "security"
  | "non-tech"
  | "unknown";

type RoleSignals = {
  bucket: RoleBucket;
  showGithub: boolean;
  showPortfolio: boolean;
  showCodingProfile: boolean;
  showLiveProjects: boolean;
  showCloudLinks: boolean;
  showCertifications: boolean;
};

const SOFTWARE_KEYWORDS = [
  "software",
  "frontend",
  "backend",
  "full stack",
  "full-stack",
  "web developer",
  "developer",
  "engineer",
  "react",
  "next.js",
  "node",
  "javascript",
  "typescript",
  "java",
  "python",
  "mobile",
  "android",
  "ios",
  "sde",
];

const DATA_KEYWORDS = [
  "data scientist",
  "data analyst",
  "machine learning",
  "ml",
  "ai",
  "analytics",
  "data engineer",
  "deep learning",
  "nlp",
  "computer vision",
];

const DEVOPS_KEYWORDS = [
  "devops",
  "cloud",
  "sre",
  "site reliability",
  "platform engineer",
  "infrastructure",
  "kubernetes",
  "docker",
  "ci/cd",
  "terraform",
  "aws",
  "azure",
  "gcp",
];

const QA_KEYWORDS = [
  "qa",
  "quality assurance",
  "test engineer",
  "sdet",
  "automation tester",
  "manual testing",
  "testing",
];

const DESIGN_KEYWORDS = [
  "ui/ux",
  "ux",
  "ui",
  "product designer",
  "product design",
  "design",
  "figma",
  "sketch",
  "adobe xd",
  "prototype",
];

const SECURITY_KEYWORDS = [
  "cybersecurity",
  "security analyst",
  "penetration",
  "pentest",
  "vulnerability",
  "soc",
  "siem",
  "incident response",
];

const NON_TECH_KEYWORDS = [
  "waiter",
  "waitress",
  "cashier",
  "sales assistant",
  "delivery",
  "receptionist",
  "teacher",
  "accountant",
  "nurse",
  "driver",
  "store",
  "retail",
  "hospitality",
];

const CODING_PROFILE_KEYWORDS = [
  "leetcode",
  "codeforces",
  "hackerrank",
  "dsa",
  "competitive",
  "coding challenge",
];

const LIVE_PROJECT_KEYWORDS = [
  "live",
  "deployed",
  "demo",
  "production",
  "portfolio site",
];

const PORTFOLIO_KEYWORDS = [
  "portfolio",
  "dribbble",
  "behance",
  "case study",
  "case studies",
  "figma",
  "ux",
  "ui",
];

function normalize(text: string): string {
  return text.toLowerCase();
}

function hasAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

export function analyzeJobDescription(input: string): RoleSignals {
  const text = normalize(input);
  const hasNonTech = hasAny(text, NON_TECH_KEYWORDS);
  const isSoftware = hasAny(text, SOFTWARE_KEYWORDS);
  const isData = hasAny(text, DATA_KEYWORDS);
  const isDevOps = hasAny(text, DEVOPS_KEYWORDS);
  const isQa = hasAny(text, QA_KEYWORDS);
  const isDesign = hasAny(text, DESIGN_KEYWORDS);
  const isSecurity = hasAny(text, SECURITY_KEYWORDS);

  let bucket: RoleBucket = "unknown";
  if (isDesign) bucket = "design";
  else if (isSecurity) bucket = "security";
  else if (isDevOps) bucket = "devops";
  else if (isData) bucket = "data";
  else if (isQa) bucket = "qa";
  else if (isSoftware) bucket = "software";

  if (bucket === "unknown" && hasNonTech) {
    bucket = "non-tech";
  }

  const showGithub =
    bucket === "software" ||
    bucket === "data" ||
    bucket === "devops" ||
    bucket === "qa" ||
    bucket === "security";
  const showPortfolio = bucket === "design" || hasAny(text, PORTFOLIO_KEYWORDS);
  const showCodingProfile =
    bucket === "software" && hasAny(text, CODING_PROFILE_KEYWORDS);
  const showLiveProjects =
    bucket === "software" && hasAny(text, LIVE_PROJECT_KEYWORDS);
  const showCloudLinks = bucket === "devops";
  const showCertifications =
    bucket === "data" ||
    bucket === "devops" ||
    bucket === "security" ||
    bucket === "qa";

  return {
    bucket,
    showGithub,
    showPortfolio,
    showCodingProfile,
    showLiveProjects,
    showCloudLinks,
    showCertifications,
  };
}

type BuildQuestionsOptions = {
  mode: "withJd" | "scratch";
  jobDescription?: string;
};

export function buildQuestions({
  mode,
  jobDescription = "",
}: BuildQuestionsOptions): ChatQuestion[] {
  const trimmed = jobDescription.trim();
  const signals = analyzeJobDescription(trimmed);

  if (mode === "scratch" && !trimmed) {
    return [
      {
        id: "jd",
        question:
          "Paste the job description for the role. If you do not have one, describe the target tech role and stack.",
        type: "textarea",
        field: "jobDescription",
      },
    ];
  }

  const baseQuestions: ChatQuestion[] = [
    {
      id: "name",
      question: "What's your full name?",
      type: "text",
      field: "name",
    },
    {
      id: "contact",
      question: "Let's grab your contact info — enter your Email and Phone.",
      type: "contact",
      field: "contact",
      meta: { showGithub: false, showLinkedin: false },
    },
    {
      id: "location",
      question: "What is your current location (City, State)?",
      type: "text",
      field: "location",
    },
    {
      id: "linkedin",
      question: "Share your LinkedIn profile link.",
      type: "text",
      field: "linkedin",
    },
    {
      id: "experience",
      question: "How many years of experience do you have?",
      type: "experience",
      field: "experience",
    },
  ];

  const questions: ChatQuestion[] = [...baseQuestions];

  if (signals.bucket === "software") {
    questions.push(
      {
        id: "tech",
        question: "What are your technical skills?",
        type: "techSkills",
        field: "techSkills",
      },
      {
        id: "soft",
        question: "What are your soft skills?",
        type: "softSkills",
        field: "softSkills",
      },
      {
        id: "work",
        question:
          "Describe your work experience (company, role, duration, what you did).",
        type: "textarea",
        field: "workExperience",
      },
      {
        id: "project",
        question: "Tell me about a project you built.",
        type: "project",
        field: "projects",
      },
    );

    if (signals.showLiveProjects) {
      questions.push({
        id: "live-projects",
        question: "Share any live/deployed project links (if available).",
        type: "text",
        field: "liveProjects",
      });
    }

    if (signals.showGithub) {
      questions.push({
        id: "github",
        question: "Share your GitHub profile link (if available).",
        type: "text",
        field: "github",
      });
    }

    if (signals.showCodingProfile) {
      questions.push({
        id: "coding-profile",
        question:
          "Share your coding profile links (LeetCode, Codeforces, etc.) if relevant.",
        type: "text",
        field: "codingProfiles",
      });
    }
  }

  if (signals.bucket === "data") {
    questions.push(
      {
        id: "tech",
        question:
          "List your core data/ML skills and tools (Python, SQL, libraries).",
        type: "textarea",
        field: "dataTools",
      },
      {
        id: "soft",
        question: "What are your soft skills?",
        type: "softSkills",
        field: "softSkills",
      },
      {
        id: "work",
        question:
          "Describe your data/ML experience or projects (impact, datasets, tools).",
        type: "textarea",
        field: "workExperience",
      },
    );

    if (signals.showGithub) {
      questions.push({
        id: "github",
        question:
          "Share your GitHub or notebook repository links (if available).",
        type: "text",
        field: "github",
      });
    }
  }

  if (signals.bucket === "devops") {
    questions.push(
      {
        id: "tools",
        question:
          "List your cloud platforms and DevOps tools (CI/CD, Docker, Kubernetes).",
        type: "textarea",
        field: "devopsTools",
      },
      {
        id: "work",
        question:
          "Describe your infra/automation experience (projects, scale, impact).",
        type: "textarea",
        field: "workExperience",
      },
    );

    if (signals.showGithub) {
      questions.push({
        id: "github",
        question: "Share your GitHub/IaC repos if relevant.",
        type: "text",
        field: "github",
      });
    }
  }

  if (signals.bucket === "qa") {
    questions.push(
      {
        id: "testing-type",
        question: "Do you focus on manual testing, automation, or both?",
        type: "text",
        field: "testingType",
      },
      {
        id: "testing-tools",
        question:
          "List testing tools/frameworks you use (Selenium, Cypress, etc.).",
        type: "textarea",
        field: "testingTools",
      },
      {
        id: "work",
        question:
          "Describe your QA/testing experience and key responsibilities.",
        type: "textarea",
        field: "workExperience",
      },
    );

    if (signals.showGithub) {
      questions.push({
        id: "github",
        question:
          "Share your GitHub repo links if relevant (automation frameworks).",
        type: "text",
        field: "github",
      });
    }
  }

  if (signals.bucket === "design") {
    questions.push(
      {
        id: "tools",
        question: "Which design tools do you use (Figma, Adobe XD, etc.)?",
        type: "textarea",
        field: "designTools",
      },
      {
        id: "process",
        question:
          "Briefly describe your design process (research, wireframes, prototypes).",
        type: "textarea",
        field: "designProcess",
      },
    );

    if (signals.showPortfolio) {
      questions.push({
        id: "portfolio",
        question: "Share your portfolio(if not provided) or case study links.",
        type: "text",
        field: "portfolio",
      });
    }
  }

  if (signals.bucket === "security") {
    questions.push(
      {
        id: "tools",
        question: "List security tools/platforms you have used.",
        type: "textarea",
        field: "securityTools",
      },
      {
        id: "labs",
        question:
          "Describe labs, assessments, or security projects you have worked on.",
        type: "textarea",
        field: "securityProjects",
      },
    );

    if (signals.showGithub) {
      questions.push({
        id: "github",
        question: "Share relevant GitHub or project links (if available).",
        type: "text",
        field: "github",
      });
    }
  }

  if (
    signals.showPortfolio &&
    signals.bucket !== "design" &&
    signals.bucket !== "software"
  ) {
    questions.push({
      id: "portfolio",
      question:
        "Share your portfolio(if not provided) or case study links (if applicable).",
      type: "text",
      field: "portfolio",
    });
  }

  if (signals.showCertifications) {
    questions.push({
      id: "certs",
      question: "List any relevant certifications (if you have them).",
      type: "textarea",
      field: "certifications",
    });
  }

  questions.push(
    {
      id: "education",
      question: "Tell me about your education (degree, institution, year).",
      type: "textarea",
      field: "education",
    },
    {
      id: "challenge",
      question:
        "Describe a professional challenge you solved (problem → action → result).",
      type: "textarea",
      field: "challenge",
    },
  );

  return questions;
}
