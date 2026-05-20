"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeJobDescription, buildQuestions } from "@/lib/chatQuestions";
import ChatBubble from "./ChatBubble";
import QuestionRenderer from "./QuestionRenderer";

type Message = { sender: "ai" | "user"; text: string };
type ChatWindowProps = { jobDescription: string; mode: "withJd" | "scratch" };

async function enhanceAnswer(
  answer: string,
  field: string,
  jd: string,
): Promise<string> {
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
    const data = (await res.json()) as {
      problem?: string;
      action?: string;
      result?: string;
    };
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

export default function ChatWindow({
  jobDescription,
  mode,
}: ChatWindowProps): React.JSX.Element {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [resumeData, setResumeData] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [jdContext, setJdContext] = useState(jobDescription);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const [questions, setQuestions] = useState(() =>
    buildQuestions({ mode, jobDescription: jobDescription }),
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollDown = useCallback(() => {
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  }, []);

  useEffect(() => {
    setJdContext(jobDescription);
  }, [jobDescription]);

  useEffect(() => {
    setQuestions(buildQuestions({ mode, jobDescription: jdContext }));
  }, [mode, jdContext]);

  useEffect(() => {
    if (mode !== "withJd") {
      setBlockedMessage(null);
      return;
    }

    const trimmed = jdContext.trim();
    if (!trimmed) {
      setBlockedMessage("Please provide a tech job description to continue.");
      return;
    }

    const analysis = analyzeJobDescription(trimmed);
    if (analysis.bucket === "non-tech" || analysis.bucket === "unknown") {
      setBlockedMessage(
        "This flow is optimized for tech roles only. Please provide a tech job description to continue.",
      );
      return;
    }

    setBlockedMessage(null);
  }, [mode, jdContext]);

  useEffect(() => {
    if (blockedMessage) {
      setMessages([{ sender: "ai", text: blockedMessage }]);
      setStep(0);
      setProcessing(false);
      return;
    }

    if (messages.length === 0 && questions.length > 0) {
      setMessages([{ sender: "ai", text: questions[0].question }]);
    }
  }, [blockedMessage, messages.length, questions]);

  useEffect(scrollDown, [messages, scrollDown]);

  const handleAnswer = async (answer: string) => {
    const q = questions[step];
    if (!q || processing) return;

    setMessages((prev) => [...prev, { sender: "user", text: answer }]);
    setProcessing(true);

    const enhanceFields = new Set([
      "workExperience",
      "projects",
      "education",
      "designProcess",
      "designTools",
      "dataTools",
      "devopsTools",
      "testingTools",
      "securityProjects",
      "securityTools",
      "certifications",
    ]);
    let enhanced: string;

    if (q.field === "jobDescription") {
      const analysis = analyzeJobDescription(answer);
      if (analysis.bucket === "non-tech" || analysis.bucket === "unknown") {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "This flow is optimized for tech roles only. Please provide a tech job description.",
          },
          { sender: "ai", text: q.question },
        ]);
        setProcessing(false);
        setJdContext("");
        return;
      }
      enhanced = answer;
      const trimmed = answer.trim();
      setJdContext(trimmed);
      const nextQuestions = buildQuestions({ mode, jobDescription: trimmed });
      setQuestions(nextQuestions);
      setStep(0);
      setProcessing(false);
      if (nextQuestions.length > 0) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: nextQuestions[0].question },
        ]);
      }
      return;
    } else if (q.field === "challenge") {
      enhanced = await enhanceChallenge(answer);
    } else if (!enhanceFields.has(q.field)) {
      enhanced = answer;
    } else {
      enhanced = await enhanceAnswer(answer, q.field, jdContext);
    }

    if (q.field !== "jobDescription") {
      setResumeData((prev) => ({ ...prev, [q.field]: enhanced }));
    }
    const nextStep = step + 1;

    if (nextStep < questions.length) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: questions[nextStep].question },
      ]);
      setStep(nextStep);
      setProcessing(false);
    } else {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Generating your resume... ✨" },
      ]);
      const allData =
        q.field === "jobDescription"
          ? { ...resumeData }
          : { ...resumeData, [q.field]: enhanced };
      if (allData.linkedin) {
        const contactPrefix = allData.contact ? `${allData.contact} | ` : "";
        allData.contact = `${contactPrefix}LinkedIn: ${allData.linkedin}`;
      }
      const resume = await generateResume(allData, jdContext);

      if (resume) {
        sessionStorage.setItem("finalResume", resume);
        sessionStorage.setItem("resumeSource", "chat");
        router.push("/preview");
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "Something went wrong. Please try again." },
        ]);
        setProcessing(false);
      }
    }
  };

  const currentQ = blockedMessage ? null : (questions[step] ?? null);

  return (
    <div className="mx-auto flex h-[calc(80vh)] w-full max-w-2xl flex-col">
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
            onAnswer={(val) => {
              void handleAnswer(val);
            }}
            disabled={processing}
            meta={currentQ.meta}
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
