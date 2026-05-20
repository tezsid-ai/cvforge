import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | CVForge",
  description:
    "Privacy Policy for CVForge, an AI resume builder by Tezsid Designs Pvt Ltd.",
};

const sections = [
  {
    title: "Information We Collect",
    points: [
      "Personal details you enter, such as name, email address, phone number, city, state, LinkedIn URL, GitHub URL, portfolio links, and other contact information.",
      "Resume-related information, such as education, skills, work experience, projects, achievements, certifications, career goals, job descriptions, and resume files or resume text you upload or paste.",
      "Technical information, such as browser type, device information, pages visited, usage activity, error logs, and approximate location derived from standard web technologies.",
    ],
  },
  {
    title: "How We Use Your Information",
    points: [
      "To generate, analyze, improve, and format resumes based on your inputs.",
      "To tailor resume content for a target role, job description, skill set, or career direction.",
      "To provide ATS-related suggestions, keyword matching, and content improvement recommendations.",
      "To maintain website functionality, improve user experience, troubleshoot issues, and protect the service from misuse.",
      "To respond to questions, support requests, feedback, or legal and compliance needs.",
    ],
  },
  {
    title: "AI Processing",
    points: [
      "CVForge may process your resume data and job-related inputs through AI systems to generate suggestions and final resume content.",
      "You should avoid entering sensitive personal data that is not needed for resume creation, such as passwords, financial information, government ID numbers, medical details, or confidential employer data.",
      "AI output should be reviewed by you before use because it may need correction, editing, or verification.",
    ],
  },
  {
    title: "Data Storage And Security",
    points: [
      "We use reasonable technical and organizational measures to protect user information from unauthorized access, misuse, loss, or alteration.",
      "No method of internet transmission or electronic storage is completely secure, so we cannot guarantee absolute security.",
      "Some resume data may be stored temporarily in your browser session or local storage to support previews, downloads, and navigation within the app.",
    ],
  },
  {
    title: "Sharing Of Information",
    points: [
      "We do not sell your personal information.",
      "We may share limited information with trusted service providers only when needed to operate, host, secure, analyze, or improve CVForge.",
      "We may disclose information if required by law, regulation, legal process, government request, or to protect the rights, safety, and security of users, the public, or Tezsid Designs Pvt Ltd.",
    ],
  },
  {
    title: "Cookies And Similar Technologies",
    points: [
      "CVForge may use cookies, local storage, or similar technologies to keep the website functional, remember session data, improve performance, and understand usage patterns.",
      "You can control cookies through your browser settings, but disabling them may affect certain website features.",
    ],
  },
  {
    title: "Your Rights And Choices",
    points: [
      "You may request access, correction, update, or deletion of personal information you have provided, subject to applicable law and technical feasibility.",
      "You may stop using CVForge at any time and clear locally stored browser data from your device.",
      "To raise a privacy request, contact us using the email address listed below.",
    ],
  },
  {
    title: "Children's Privacy",
    points: [
      "CVForge is intended for students, freshers, professionals, and job seekers who can lawfully use online services.",
      "We do not knowingly collect personal information from children where parental consent is required by applicable law.",
    ],
  },
  {
    title: "Changes To This Policy",
    points: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or service features.",
      "The updated policy will be posted on this page with a revised published or effective date.",
    ],
  },
];

export default function PrivacyPolicyPage(): React.JSX.Element {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] px-6 py-14 text-zinc-100 sm:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto max-w-4xl animate-fade-in-up">
        <Link
          href="/"
          className="mb-8 inline-flex text-sm font-medium text-violet-200 transition hover:text-white"
        >
         &larr; Back to home
        </Link>

        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-200">
            Published: May 20, 2026
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-5 text-base leading-7 text-zinc-300">
            This Privacy Policy explains how Tezsid Designs Pvt Ltd collects,
            uses, stores, and protects information when you use CVForge, our AI
            Resume Builder. By using CVForge, you agree to the practices
            described below.
          </p>

          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold text-white">
                  {section.title}
                </h2>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-zinc-300">
                  {section.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <section className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-5">
              <h2 className="text-xl font-semibold text-white">Contact</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                For privacy questions, data requests, or concerns, contact
                Tezsid Designs Pvt Ltd at{" "}
                <a
                  href="mailto:info@tezsid.com"
                  className="font-medium text-violet-200 hover:text-white"
                >
                  info@tezsid.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
