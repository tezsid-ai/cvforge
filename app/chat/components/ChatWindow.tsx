"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { buildWithJdQuestions, buildWithoutJdQuestions } from "@/lib/chatQuestions";
import { enhanceAnswer, enhanceChallenge, generateResume, parseChatLinks } from "../lib/chatApi";
import ChatBubble from "./ChatBubble";
import QuestionRenderer from "./QuestionRenderer";

type Message = { sender: "ai" | "user"; text: string };
type ChatWindowProps = { jobDescription: string; mode: "withJd" | "scratch" };

export default function ChatWindow({
  jobDescription,
  mode,
}: ChatWindowProps): React.JSX.Element {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [resumeData, setResumeData] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const questions = mode === "withJd"
    ? buildWithJdQuestions(jobDescription)
    : buildWithoutJdQuestions();

  const scrollDown = useCallback(() => {
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  }, []);

  useEffect(() => {
    if (messages.length === 0 && questions.length > 0) {
      setMessages([{ sender: "ai", text: questions[0].label }]);
    }
  }, [messages.length, questions]);

  useEffect(scrollDown, [messages, scrollDown]);

  const handleAnswer = async (answer: string) => {
    const q = questions[step];
    if (!q || processing) return;

    setMessages((prev) => [...prev, { sender: "user", text: answer }]);
    setProcessing(true);

    let enhanced = answer;
    const enhanceFields = new Set([
      "workExperience",
      "projects",
      "education",
      "skills",
      "summary",
      "achievements",
    ]);

    if (q.id === "challenge") {
      enhanced = await enhanceChallenge(answer);
    } else if (enhanceFields.has(q.id)) {
      enhanced = await enhanceAnswer(answer, q.id, mode === "withJd" ? jobDescription : "");
    }

    setResumeData((prev) => ({ ...prev, [q.id]: enhanced }));
    const nextStep = step + 1;

    if (nextStep < questions.length) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: questions[nextStep].label },
      ]);
      setStep(nextStep);
      setProcessing(false);
    } else {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Generating your optimized resume... ✨" },
      ]);
      
      const allData = { ...resumeData, [q.id]: enhanced };
      const links = parseChatLinks(allData.links || allData.linkedin || "");
      const resume = await generateResume(allData, mode === "withJd" ? jobDescription : "");

      if (resume) {
        sessionStorage.setItem("finalResume", resume);
        sessionStorage.setItem("resumeSource", "chat");
        sessionStorage.setItem("analysisResult", JSON.stringify(links));
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

  const currentQ = questions[step] ?? null;

  return (
    <div className="mx-auto flex h-[calc(80vh)] w-full max-w-2xl flex-col bg-zinc-950/80 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden animate-fade-in">
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          AI Chat Builder
        </span>
        <span className="text-xs font-medium text-violet-400">
          Question {Math.min(step + 1, questions.length)} of {questions.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 hide-scrollbar space-y-4">
        {messages.map((msg, i) => (
          <ChatBubble key={i} sender={msg.sender} text={msg.text} />
        ))}
        {processing && (
          <div className="flex items-center space-x-2 text-zinc-500 pl-4 py-2">
            <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:0.2s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:0.4s]" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-zinc-800 bg-zinc-900/30 px-4 py-4">
        {currentQ && !processing ? (
          <QuestionRenderer
            question={currentQ}
            onAnswer={handleAnswer}
            disabled={processing}
          />
        ) : !currentQ && !processing ? (
          <div className="text-center py-2 text-sm text-zinc-500">All set!</div>
        ) : null}
      </div>
    </div>
  );
}
