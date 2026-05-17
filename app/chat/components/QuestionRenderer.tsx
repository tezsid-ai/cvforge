"use client";

import type { QuestionType } from "@/lib/chatQuestions";
import ChatInput from "./ChatInput";
import SkillChips from "./SkillChips";
import ExperienceSlider from "./ExperienceSlider";
import RoleCards from "./RoleCards";
import SoftSkillBadges from "./SoftSkillBadges";
import ProjectCard from "./ProjectCard";
import ContactForm from "./ContactForm";

type QuestionRendererProps = {
  type: QuestionType;
  onAnswer: (value: string) => void;
  disabled: boolean;
};

export default function QuestionRenderer({
  type,
  onAnswer,
  disabled,
}: QuestionRendererProps): React.JSX.Element {
  switch (type) {
    case "contact":
      return <ContactForm onSubmit={onAnswer} />;
    case "role":
      return <RoleCards onSubmit={onAnswer} />;
    case "experience":
      return <ExperienceSlider onSubmit={onAnswer} />;
    case "techSkills":
      return <SkillChips onSubmit={(skills) => onAnswer(skills.join(", "))} />;
    case "softSkills":
      return <SoftSkillBadges onSubmit={(skills) => onAnswer(skills.join(", "))} />;
    case "project":
      return <ProjectCard onSubmit={onAnswer} />;
    case "textarea":
      return (
        <ChatInput
          onSubmit={onAnswer}
          multiline
          disabled={disabled}
          placeholder="Type your detailed answer..."
        />
      );
    default:
      return (
        <ChatInput
          onSubmit={onAnswer}
          disabled={disabled}
          placeholder="Type your answer..."
        />
      );
  }
}
