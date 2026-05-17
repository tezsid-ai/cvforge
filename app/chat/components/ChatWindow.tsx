"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "@/lib/chatQuestions";
import ChatBubble from "./ChatBubble";
import QuestionRenderer from "./QuestionRenderer";

type Message = { sender: "ai" | "user"; text: string };
type ChatWindowProps = { jobDescription: string };

async function enhanceAnswer(answer: string, field: string, jd: string): Promise<string> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer, field, jobDescription: jd || undefined }),
    });
    const data = (await res.json()) as { enhanced?: string };
    return data.enhanced ?? answer;
  } catch {
    return answer;
  }
}

async function enhanceChallenge(text: string): Promise<string> {
  try {
    const res = await fetch("/api/challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeText: text }),
    });
    const data = (await res.json()) as { problem?: string; action?: string; result?: string };
    if (data.problem) {
      return `Problem: ${data.problem}\nAction: ${data.action}\nResult: ${data.result}`;
    }
    return text;
  } catch {
    return text;
  }
}

async function generateResume(
  resumeData: Record<string, string>,
  jd: string,
): Promise<string | null> {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeData, jobDescription: jd || undefined }),
    });
    const data = (await res.json()) as { finalResume?: string };
    return data.finalResume ?? null;
  } catch {
    return null;
  }
}

export default function ChatWindow({ jobDescription }: ChatWindowProps): React.JSX.Element {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [resumeData, setResumeData] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollDown = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, []);

  useEffect(() => {
    setMessages([{ sender: "ai", text: QUESTIONS[0].question }]);
  }, []);

  useEffect(scrollDown, [messages, scrollDown]);

  const handleAnswer = async (answer: string) => {
    const q = QUESTIONS[step];
    if (!q || processing) return;

    setMessages((prev) => [...prev, { sender: "user", text: answer }]);
    setProcessing(true);

    const skipEnhance = ["role", "experience", "techSkills", "softSkills"];
    let enhanced: string;

    if (q.field === "challenge") {
      enhanced = await enhanceChallenge(answer);
    } else if (skipEnhance.includes(q.type)) {
      enhanced = answer;
    } else {
      enhanced = await enhanceAnswer(answer, q.field, jobDescription);
    }

    setResumeData((prev) => ({ ...prev, [q.field]: enhanced }));
    const nextStep = step + 1;

    if (nextStep < QUESTIONS.length) {
      setMessages((prev) => [...prev, { sender: "ai", text: QUESTIONS[nextStep].question }]);
      setStep(nextStep);
      setProcessing(false);
    } else {
      setMessages((prev) => [...prev, { sender: "ai", text: "Generating your resume... ✨" }]);
      const allData = { ...resumeData, [q.field]: enhanced };
      const resume = await generateResume(allData, jobDescription);

      if (resume) {
        sessionStorage.setItem("finalResume", resume);
        router.push("/preview");
      } else {
        setMessages((prev) => [...prev, { sender: "ai", text: "Something went wrong. Please try again." }]);
        setProcessing(false);
      }
    }
  };

  const currentQ = QUESTIONS[step] ?? null;

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] w-full max-w-2xl flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6 hide-scrollbar">
        {messages.map((msg, i) => (
          <ChatBubble key={i} sender={msg.sender} text={msg.text} />
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-zinc-800 px-4 py-4">
        {currentQ && !processing ? (
          <QuestionRenderer
            type={currentQ.type}
            onAnswer={(val) => { void handleAnswer(val); }}
            disabled={processing}
          />
        ) : (
          <div className="flex items-center justify-center py-3">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-violet-400" />
            <span className="ml-2 text-sm text-zinc-400">Processing...</span>
          </div>
        )}
      </div>
    </div>
  );
}
