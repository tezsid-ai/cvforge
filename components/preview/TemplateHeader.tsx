import type { ContactInfo } from "@/types/resume";

type TemplateHeaderProps = {
  name: string;
  jobTitle: string;
  contact: ContactInfo;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  otherLinks?: string[] | null;
};

export default function TemplateHeader({
  name,
  jobTitle,
  contact,
  linkedinUrl,
  githubUrl,
  portfolioUrl,
  otherLinks,
}: TemplateHeaderProps): React.JSX.Element {
  const elements: React.ReactNode[] = [];

  if (contact.email) {
    elements.push(
      <a
        key="email"
        href={`mailto:${contact.email}`}
        className="text-gray-700 hover:text-gray-900 underline print:text-gray-900"
      >
        Email: {contact.email}
      </a>,
    );
  }

  if (contact.phone) {
    elements.push(
      <a
        key="phone"
        href={`tel:${contact.phone.replace(/\s/g, "")}`}
        className="text-gray-700 hover:text-gray-900 underline print:text-gray-900"
      >
        Phone: {contact.phone}
      </a>,
    );
  }

  const activeLinkedin = linkedinUrl || contact.linkedin;
  if (activeLinkedin) {
    const url = activeLinkedin.startsWith("http")
      ? activeLinkedin
      : `https://${activeLinkedin.replace(/^@/, "")}`;
    elements.push(
      <a
        key="linkedin"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-700 hover:text-gray-900 underline print:text-gray-900"
      >
        LinkedIn: {url}
      </a>,
    );
  }

  const activeGithub = githubUrl || contact.github;
  if (activeGithub) {
    const url = activeGithub.startsWith("http")
      ? activeGithub
      : `https://github.com/${activeGithub.replace(/^@/, "").replace("github.com/", "")}`;
    elements.push(
      <a
        key="github"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-700 hover:text-gray-900 underline print:text-gray-900"
      >
        GitHub: {url}
      </a>,
    );
  }

  const activePortfolio = portfolioUrl || contact.website;
  if (activePortfolio) {
    const url = activePortfolio.startsWith("http")
      ? activePortfolio
      : `https://${activePortfolio}`;
    elements.push(
      <a
        key="portfolio"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-700 hover:text-gray-900 underline print:text-gray-900"
      >
        Portfolio: {url}
      </a>,
    );
  }

  if (otherLinks && otherLinks.length > 0) {
    otherLinks.forEach((url, index) => {
      elements.push(
        <a
          key={`other-${index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-gray-900 underline print:text-gray-900"
        >
          Link: {url}
        </a>,
      );
    });
  }

  return (
    <header className="mb-5 text-center">
      {name && (
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {name}
        </h1>
      )}
      {jobTitle && (
        <p className="mt-0.5 text-sm font-medium text-gray-600">{jobTitle}</p>
      )}
      {elements.length > 0 && (
        <div className="mt-2 text-center text-xs text-gray-700 block">
          {elements.map((el, index) => (
            <span key={index} className="inline-block">
              {el}
              {index < elements.length - 1 && (
                <span className="mx-2 text-gray-400 font-normal">|</span>
              )}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
