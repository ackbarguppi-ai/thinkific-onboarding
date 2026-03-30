"use client";

interface ChatMessageProps {
  role: "assistant" | "user";
  children: React.ReactNode;
}

export default function ChatMessage({ role, children }: ChatMessageProps) {
  if (role === "assistant") {
    return (
      <div className="flex items-start gap-3 animate-fade-slide-up">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-indigo flex items-center justify-center text-white text-sm font-bold">
          T
        </div>
        <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-surface-light px-4 py-3 text-[#e4e4ed]">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end animate-fade-slide-up">
      <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-accent-indigo px-4 py-3 text-white">
        {children}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-slide-up">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-indigo flex items-center justify-center text-white text-sm font-bold">
        T
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-surface-light px-4 py-3 flex gap-1.5">
        <span className="typing-dot w-2 h-2 rounded-full bg-[#e4e4ed]" />
        <span className="typing-dot w-2 h-2 rounded-full bg-[#e4e4ed]" />
        <span className="typing-dot w-2 h-2 rounded-full bg-[#e4e4ed]" />
      </div>
    </div>
  );
}
