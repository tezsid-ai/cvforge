type TemplateSectionProps = {
  title: string;
  children: React.ReactNode;
};

export default function TemplateSection({
  title,
  children,
}: TemplateSectionProps): React.JSX.Element {
  return (
    <section className="mb-5">
      <h2 className="mb-1.5 border-b border-gray-400 pb-1 text-xs font-bold uppercase tracking-widest text-gray-800">
        {title}
      </h2>
      <div className="text-sm leading-relaxed text-gray-700">{children}</div>
    </section>
  );
}
