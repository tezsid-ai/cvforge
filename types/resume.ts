export type ContactInfo = {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  website: string;
};

export type ExperienceEntry = {
  title: string;
  company: string;
  duration: string;
  bullets: string[];
};

export type EducationEntry = {
  institution: string;
  degree: string;
  duration: string;
  grade: string;
};

export type ProjectEntry = {
  name: string;
  techStack: string;
  bullets: string[];
};

export type ChallengeSection = {
  problem: string;
  action: string;
  result: string;
};

export type ResumeData = {
  name: string;
  jobTitle: string;
  contact: ContactInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  projects: ProjectEntry[];
  challenge: ChallengeSection | null;
};
