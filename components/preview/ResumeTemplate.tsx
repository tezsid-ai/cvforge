"use client";

import { AlertCircle, Wrench, CheckCircle2 } from "lucide-react";
import type { ResumeData } from "@/types/resume";
import TemplateSection from "./TemplateSection";
import { isEmptyOrNone, getHumanLabel, getGroupedSkills, getAchievements } from "./resumeHelpers";

type ResumeTemplateProps = {
  data: ResumeData;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  otherLinks?: string[] | null;
};

export default function ResumeTemplate({
  data,
  linkedinUrl,
  githubUrl,
  portfolioUrl,
  otherLinks,
}: ResumeTemplateProps): React.JSX.Element {
  const rawResume = typeof window !== "undefined" ? sessionStorage.getItem("finalResume") : "";
  const email = data.contact?.email?.trim();
  const phone = data.contact?.phone?.trim();
  const activeLinkedin = (linkedinUrl || data.contact?.linkedin || "").trim();
  const activeGithub = (githubUrl || data.contact?.github || "").trim();
  const activePortfolio = (portfolioUrl || data.contact?.website || "").trim();

  const items: React.ReactNode[] = [];
  if (email && !isEmptyOrNone(email)) {
    items.push(<a key="email" href={`mailto:${email}`} className="underline">{email}</a>);
  }
  if (phone && !isEmptyOrNone(phone)) {
    items.push(<a key="phone" href={`tel:${phone.replace(/\s/g, "")}`} className="underline">{phone}</a>);
  }
  if (activeLinkedin && !isEmptyOrNone(activeLinkedin)) {
    const href = activeLinkedin.startsWith("http") ? activeLinkedin : `https://${activeLinkedin}`;
    items.push(<a key="linkedin" href={href} target="_blank" rel="noopener noreferrer" className="underline">LinkedIn: {activeLinkedin}</a>);
  }
  if (activeGithub && !isEmptyOrNone(activeGithub)) {
    const href = activeGithub.startsWith("http") ? activeGithub : `https://${activeGithub}`;
    items.push(<a key="github" href={href} target="_blank" rel="noopener noreferrer" className="underline">GitHub: {activeGithub}</a>);
  }
  if (activePortfolio && !isEmptyOrNone(activePortfolio)) {
    const href = activePortfolio.startsWith("http") ? activePortfolio : `https://${activePortfolio}`;
    items.push(<a key="portfolio" href={href} target="_blank" rel="noopener noreferrer" className="underline">Portfolio: {activePortfolio}</a>);
  }
  if (otherLinks) {
    otherLinks.forEach((link, idx) => {
      const t = link?.trim();
      if (t && !isEmptyOrNone(t)) {
        const href = t.startsWith("http") ? t : `https://${t}`;
        items.push(<a key={`oth-${idx}`} href={href} target="_blank" rel="noopener noreferrer" className="underline">{getHumanLabel(t)}</a>);
      }
    });
  }

  const showSummary = !isEmptyOrNone(data.summary);
  const groupedSkills = getGroupedSkills(rawResume);
  const showSkills = groupedSkills.length > 0 || (data.skills && data.skills.length > 0 && !isEmptyOrNone(data.skills[0]));

  const uniqueExperience = data.experience.filter(e => !isEmptyOrNone(e.title) && !isEmptyOrNone(e.bullets)).map(entry => ({
    ...entry,
    bullets: entry.bullets.filter(b => !isEmptyOrNone(b))
  })).filter(entry => entry.bullets.length > 0);

  const uniqueProjects = data.projects.filter(p => 
    !isEmptyOrNone(p.name) && !isEmptyOrNone(p.bullets) && 
    !uniqueExperience.some(e => e.title.toLowerCase() === p.name.toLowerCase() || e.company.toLowerCase() === p.name.toLowerCase())
  ).map(entry => ({
    ...entry,
    bullets: entry.bullets.filter(b => !isEmptyOrNone(b))
  })).filter(entry => entry.bullets.length > 0);

  const validEducation = data.education.filter(e => !isEmptyOrNone(e.institution));
  const achievements = getAchievements(rawResume);

  return (
    <article id="resume-template" className="mx-auto w-full max-w-[794px] bg-white font-sans text-black shadow-sm print:max-w-none print:shadow-none print:block print:p-[20mm] print:m-0" style={{ padding: "20px" }}>
      <header className="mb-5 text-center">
        {data.name && <h1 className="text-2xl font-bold tracking-tight text-gray-900">{data.name}</h1>}
        {data.jobTitle && <p className="mt-0.5 text-sm font-medium text-gray-600">{data.jobTitle}</p>}
        {items.length > 0 && (
          <div className="mt-2 text-center text-xs text-gray-700 block space-x-2">
            {items.map((item, index) => (
              <span key={index} className="inline-block">
                {item}
                {index < items.length - 1 && <span className="ml-2 text-gray-400 font-normal">|</span>}
              </span>
            ))}
          </div>
        )}
      </header>

      {showSummary && (
        <TemplateSection title="Summary">
          <p className="text-sm text-gray-800 leading-relaxed">{data.summary}</p>
        </TemplateSection>
      )}

      {showSkills && (
        <TemplateSection title="Skills">
          {groupedSkills.length > 0 ? (
            <div className="space-y-1 text-sm text-gray-800 leading-relaxed">
              {groupedSkills.map((line, idx) => <p key={idx}>{line}</p>)}
            </div>
          ) : (
            <p className="text-sm text-gray-800 leading-relaxed">{data.skills.join(", ")}</p>
          )}
        </TemplateSection>
      )}

      {uniqueExperience.length > 0 && (
        <TemplateSection title="Experience">
          {uniqueExperience.map((entry, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <p className="font-semibold text-sm text-gray-900">{entry.title}{entry.company ? ` – ${entry.company}` : ""}</p>
              {entry.duration && <p className="text-xs text-gray-500">{entry.duration}</p>}
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-gray-800">
                {entry.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </div>
          ))}
        </TemplateSection>
      )}

      {uniqueProjects.length > 0 && (
        <TemplateSection title="Projects">
          {uniqueProjects.map((entry, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <p className="font-semibold text-sm text-gray-900">{entry.name}{entry.techStack ? ` — ${entry.techStack}` : ""}</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-gray-800">
                {entry.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </div>
          ))}
        </TemplateSection>
      )}

      {validEducation.length > 0 && (
        <TemplateSection title="Education">
          {validEducation.map((entry, i) => (
            <div key={i} className="mb-2 last:mb-0 text-sm text-gray-800">
              <p className="font-semibold text-gray-900">{entry.institution}</p>
              {entry.degree && <p>{entry.degree}</p>}
              {entry.duration && <p className="text-xs text-gray-500">{entry.duration}</p>}
              {entry.grade && <p className="text-xs text-gray-500">{entry.grade}</p>}
            </div>
          ))}
        </TemplateSection>
      )}

      {achievements.length > 0 && (
        <TemplateSection title="Achievements">
          <ul className="list-disc space-y-0.5 pl-5 text-sm text-gray-800">
            {achievements.map((ach, idx) => <li key={idx}>{ach}</li>)}
          </ul>
        </TemplateSection>
      )}

      {data.challenge && !isEmptyOrNone(data.challenge.problem) && (
        <TemplateSection title="How I Solved a Professional Challenge">
          <div className="space-y-1.5 text-sm text-gray-800">
            <p className="flex items-center gap-1.5"><AlertCircle className="h-4 w-4 text-red-500 shrink-0" /><span className="font-semibold">Problem:</span> {data.challenge.problem}</p>
            <p className="flex items-center gap-1.5"><Wrench className="h-4 w-4 text-zinc-500 shrink-0" /><span className="font-semibold">Action:</span> {data.challenge.action}</p>
            <p className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /><span className="font-semibold">Result:</span> {data.challenge.result}</p>
          </div>
        </TemplateSection>
      )}
    </article>
  );
}
