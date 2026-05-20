import type { ResumeData } from "@/types/resume";
import TemplateHeader from "./TemplateHeader";
import TemplateSection from "./TemplateSection";

type ResumeTemplateProps = {
  data: ResumeData;
};

export default function ResumeTemplate({
  data,
}: ResumeTemplateProps): React.JSX.Element {
  return (
    <article
      id="resume-template"
      className="mx-auto w-full max-w-3xl bg-white font-sans text-black shadow-sm print:max-w-none print:shadow-none"
      style={{ padding: "40px" }}
    >
      <TemplateHeader name={data.name} jobTitle={data.jobTitle} contact={data.contact} />

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
              {entry.duration && <p className="text-xs text-gray-500">{entry.duration}</p>}
              {entry.grade && <p className="text-xs text-gray-500">{entry.grade}</p>}
            </div>
          ))}
        </TemplateSection>
      )}

      {data.experience.length > 0 && (
        <TemplateSection title="Experience">
          {data.experience.map((entry, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <p className="font-semibold text-gray-900">
                {entry.title}{entry.company ? ` – ${entry.company}` : ""}
              </p>
              {entry.duration && (
                <p className="text-xs text-gray-500">{entry.duration}</p>
              )}
              {entry.bullets.length > 0 && (
                <ul className="mt-1 list-disc space-y-0.5 pl-5">
                  {entry.bullets.map((b, j) => <li key={j}>{b}</li>)}
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
                {entry.name}{entry.techStack ? ` — ${entry.techStack}` : ""}
              </p>
              {entry.bullets.length > 0 && (
                <ul className="mt-1 list-disc space-y-0.5 pl-5">
                  {entry.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </TemplateSection>
      )}

      {data.challenge && (
        <TemplateSection title="How I Solved a Professional Challenge">
          <div className="space-y-1.5">
            <p>
              <span className="mr-1" aria-label="Problem">🔴</span>
              <span className="font-semibold">Problem:</span> {data.challenge.problem}
            </p>
            <p>
              <span className="mr-1" aria-label="Action">🔧</span>
              <span className="font-semibold">Action:</span> {data.challenge.action}
            </p>
            <p>
              <span className="mr-1" aria-label="Result">✅</span>
              <span className="font-semibold">Result:</span> {data.challenge.result}
            </p>
          </div>
        </TemplateSection>
      )}
    </article>
  );
}
