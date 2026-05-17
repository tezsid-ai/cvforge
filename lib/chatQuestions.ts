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
};

export const QUESTIONS: ChatQuestion[] = [
  { id: "q1", question: "What's your full name?", type: "text", field: "name" },
  {
    id: "q2",
    question: "Let's grab your contact info — enter your Email, Phone, LinkedIn, and GitHub.",
    type: "contact",
    field: "contact",
  },
  {
    id: "q3",
    question: "What is your current or target job role?",
    type: "role",
    field: "jobRole",
  },
  {
    id: "q4",
    question: "How many years of experience do you have?",
    type: "experience",
    field: "experience",
  },
  {
    id: "q5",
    question: "What are your technical skills?",
    type: "techSkills",
    field: "techSkills",
  },
  {
    id: "q6",
    question: "What are your soft skills?",
    type: "softSkills",
    field: "softSkills",
  },
  {
    id: "q7",
    question: "Tell me about your education (degree, institution, year).",
    type: "textarea",
    field: "education",
  },
  {
    id: "q8",
    question: "Describe your work experience (company, role, duration, what you did).",
    type: "textarea",
    field: "workExperience",
  },
  {
    id: "q9",
    question: "Tell me about a project you built.",
    type: "project",
    field: "projects",
  },
  {
    id: "q10",
    question: "Describe a professional challenge you solved (problem → action → result).",
    type: "textarea",
    field: "challenge",
  },
];
