type ChatBubbleProps = {
  sender: "ai" | "user";
  text: string;
};

export default function ChatBubble({
  sender,
  text,
}: ChatBubbleProps): React.JSX.Element {
  const isAi = sender === "ai";
  return (
    <div className={`flex ${isAi ? "justify-start" : "justify-end"} mb-3`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isAi
            ? "rounded-bl-sm bg-zinc-800 text-zinc-100"
            : "rounded-br-sm bg-violet-600 text-white"
        }`}
      >
        {text}
      </div>
    </div>
  );
}
