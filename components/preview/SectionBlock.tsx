import type { ResumeSection } from "@/lib/resumeParser";

type SectionBlockProps = {
  section: ResumeSection;
};

function isBullet(line: string): boolean {
  return /^\s*[-•●▪*]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line);
}

function cleanBullet(line: string): string {
  return line.replace(/^\s*[-•●▪*]\s+/, "").replace(/^\s*\d+[.)]\s+/, "");
}

export default function SectionBlock({
  section,
}: SectionBlockProps): React.JSX.Element {
  // Filter out empty trailing lines
  const lines = section.lines.slice();
  while (lines.length && !lines[lines.length - 1].trim()) {
    lines.pop();
  }

  const isHeader = section.heading === "";

  return (
    <div style={{ marginBottom: "1.25rem" }}>
      {/* Section heading */}
      {section.heading && (
        <h2
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            borderBottom: "1.5px solid #334155",
            paddingBottom: "0.25rem",
            marginBottom: "0.5rem",
            color: "#1e293b",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
          }}
        >
          {section.heading}
        </h2>
      )}

      {/* Section content */}
      <div
        style={{
          fontSize: isHeader ? "0.95rem" : "0.82rem",
          lineHeight: "1.6",
          color: isHeader ? "#0f172a" : "#334155",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
        }}
      >
        {lines.map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={i} style={{ height: "0.4rem" }} />;
          }

          if (isBullet(line)) {
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "0.4rem",
                  paddingLeft: "0.75rem",
                  marginBottom: "0.15rem",
                }}
              >
                <span style={{ color: "#64748b", flexShrink: 0 }}>•</span>
                <span>{cleanBullet(line)}</span>
              </div>
            );
          }

          // Bold-looking lines (short, non-bullet, likely sub-headings)
          const isSubHeading =
            trimmed.length < 80 &&
            !trimmed.includes(".") &&
            (trimmed.includes("|") || /^[A-Z]/.test(trimmed));

          return (
            <p
              key={i}
              style={{
                margin: 0,
                fontWeight: isHeader || isSubHeading ? 600 : 400,
                fontSize: isHeader && i === 0 ? "1.25rem" : undefined,
              }}
            >
              {trimmed}
            </p>
          );
        })}
      </div>
    </div>
  );
}
