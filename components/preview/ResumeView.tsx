import { parseResumeSections } from "@/lib/resumeParser";
import SectionBlock from "./SectionBlock";

type ResumeViewProps = {
  content: string;
};

export default function ResumeView({
  content,
}: ResumeViewProps): React.JSX.Element {
  const sections = parseResumeSections(content);

  return (
    <section
      className="print:block print:p-[20mm] print:m-0 print:border-none! print:shadow-none!"
      style={{
        maxWidth: "48rem",
        width: "100%",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "0.75rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        padding: "2.5rem 2.75rem",
        color: "#0f172a",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      {sections.map((section, i) => (
        <SectionBlock key={i} section={section} />
      ))}
    </section>
  );
}
