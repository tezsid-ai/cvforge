import type { ContactInfo } from "@/types/resume";

type TemplateHeaderProps = {
  name: string;
  jobTitle: string;
  contact: ContactInfo;
};

type ContactLink = {
  label: string;
  href: string;
  external?: boolean;
};

function buildLinks(contact: ContactInfo): ContactLink[] {
  const links: ContactLink[] = [];
  if (contact.email) {
    links.push({ label: contact.email, href: `mailto:${contact.email}` });
  }
  if (contact.phone) {
    links.push({
      label: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
    });
  }
  if (contact.linkedin) {
    const url = contact.linkedin.startsWith("http")
      ? contact.linkedin
      : `https://${contact.linkedin}`;
    links.push({ label: "LinkedIn", href: url, external: true });
  }
  if (contact.github) {
    const url = contact.github.startsWith("http")
      ? contact.github
      : `https://${contact.github}`;
    links.push({ label: "GitHub", href: url, external: true });
  }
  if (contact.website) {
    links.push({ label: "Website", href: contact.website, external: true });
  }
  return links;
}

export default function TemplateHeader({
  name,
  jobTitle,
  contact,
}: TemplateHeaderProps): React.JSX.Element {
  const links = buildLinks(contact);

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
      {links.length > 0 && (
        <nav className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
          {links.map((link, index) => (
            <a
              key={`${link.href}-${link.label}-${index}`}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-gray-700 no-underline transition-colors hover:text-gray-900"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
