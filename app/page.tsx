import Link from "next/link";

type CtaCard = {
  href: string;
  icon: string;
  title: string;
  description: string;
};

const ctaCards: CtaCard[] = [
  {
    href: "/upload",
    icon: "📄",
    title: "I Already Have a Resume",
    description: "Upload your current resume and let AI sharpen every line.",
  },
  {
    href: "/chat",
    icon: "✨",
    title: "Build From Scratch",
    description: "Start from zero and craft a standout resume in minutes.",
  },
];

export default function Home(): React.JSX.Element {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a] px-6 py-16 text-zinc-100 sm:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-linear-to-br from-violet-500/25 to-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute left-0 top-1/3 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-12 animate-fade-in-up">
        <div className="max-w-3xl text-center">
          <span className="mb-5 inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1 text-sm font-medium text-violet-200">
            AI Resume Builder
          </span>
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Smart Resume Builder for Freshers 
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-zinc-300 sm:text-lg">
            Generate ATS-friendly resumes with AI-guided suggestions, clean templates, and optimized 
content designed to help students and freshers land interviews faster. 
          </p>
        </div>

        <div className="grid w-full max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
          {ctaCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border border-white/10 bg-zinc-900/60 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/70 hover:shadow-[0_0_0_1px_rgba(167,139,250,0.45),0_14px_45px_rgba(79,70,229,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-500 text-2xl shadow-lg shadow-indigo-500/25">
                <span aria-hidden="true">{card.icon}</span>
              </div>
              <h2 className="text-xl font-semibold text-white">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
