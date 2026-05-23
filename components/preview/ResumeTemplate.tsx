import { AlertCircle, Wrench, CheckCircle2 } from "lucide-react";
import type { ResumeData } from "@/types/resume";
import TemplateHeader from "./TemplateHeader";
import TemplateSection from "./TemplateSection";

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
  return (
    <article
      id="resume-template"
      className="mx-auto w-full max-w-[794px] bg-white font-sans text-black shadow-sm print:max-w-none print:shadow-none print:block print:p-[20mm] print:m-0"
      style={{ padding: "20px" }}
    >
      <TemplateHeader
        name={data.name}
        jobTitle={data.jobTitle}
        contact={data.contact}
        linkedinUrl={linkedinUrl}
        githubUrl={githubUrl}
        portfolioUrl={portfolioUrl}
        otherLinks={otherLinks}
      />

      {data.summary && (
        <TemplateSection title="Summary">
          <p>{data.summary}</p>
        </TemplateSection>
      )}

      {data.skills.length > 0 && (
        <TemplateSection title="Skills">
          <p>{data.skills.join(", ")}</p>
        </TemplateSection>
      )}

      {data.education.length > 0 && (
        <TemplateSection title="Education">
          {data.education.map((entry, i) => (
            <div key={i} className="mb-2 last:mb-0">
              <p className="font-semibold text-gray-900">{entry.institution}</p>
              {entry.degree && <p className="text-gray-700">{entry.degree}</p>}
              {entry.duration && (
                <p className="text-xs text-gray-500">{entry.duration}</p>
              )}
              {entry.grade && (
                <p className="text-xs text-gray-500">{entry.grade}</p>
              )}
            </div>
          ))}
        </TemplateSection>
      )}

      {data.experience.length > 0 && (
        <TemplateSection title="Experience">
          {data.experience.map((entry, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <p className="font-semibold text-gray-900">
                {entry.title}
                {entry.company ? ` – ${entry.company}` : ""}
              </p>
              {entry.duration && (
                <p className="text-xs text-gray-500">{entry.duration}</p>
              )}
              {entry.bullets.length > 0 && (
                <ul className="mt-1 list-disc space-y-0.5 pl-5">
                  {entry.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </TemplateSection>
      )}

      {data.projects.length > 0 && (
        <TemplateSection title="Projects">
          {data.projects.map((entry, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <p className="font-semibold text-gray-900">
                {entry.name}
                {entry.techStack ? ` — ${entry.techStack}` : ""}
              </p>
              {entry.bullets.length > 0 && (
                <ul className="mt-1 list-disc space-y-0.5 pl-5">
                  {entry.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </TemplateSection>
      )}

      {data.challenge && (
        <TemplateSection title="How I Solved a Professional Challenge">
          <div className="space-y-1.5">
            <p className="flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <span className="font-semibold">Problem:</span>{" "}
              {data.challenge.problem}
            </p>
            <p className="flex items-center gap-1.5">
              <Wrench className="h-4 w-4 text-zinc-500 shrink-0" />
              <span className="font-semibold">Action:</span>{" "}
              {data.challenge.action}
            </p>
            <p className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              <span className="font-semibold">Result:</span>{" "}
              {data.challenge.result}
            </p>
          </div>
        </TemplateSection>
      )}
    </article>
  );
}
