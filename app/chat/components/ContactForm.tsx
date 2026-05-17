"use client";

import { useState } from "react";

type ContactFormProps = {
  onSubmit: (data: string) => void;
};

export default function ContactForm({
  onSubmit,
}: ContactFormProps): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");

  const handleSubmit = () => {
    const parts = [
      email && `Email: ${email}`,
      phone && `Phone: ${phone}`,
      linkedin && `LinkedIn: ${linkedin}`,
      github && `GitHub: ${github}`,
    ].filter(Boolean);
    if (parts.length > 0) onSubmit(parts.join(" | "));
  };

  const fieldClass =
    "w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-500";

  return (
    <div className="space-y-2.5">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={fieldClass} />
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className={fieldClass} />
      <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="LinkedIn profile URL" className={fieldClass} />
      <input type="text" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="GitHub username" className={fieldClass} />
      <button
        type="button"
        disabled={!email.trim()}
        onClick={handleSubmit}
        className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-40"
      >
        Save Contact Info
      </button>
    </div>
  );
}
