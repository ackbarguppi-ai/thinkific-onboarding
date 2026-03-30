"use client";

import { useState } from "react";

interface ChatInputProps {
  onSend: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
}

export default function ChatInput({ onSend, placeholder = "Type your answer...", suggestions }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <div className="animate-fade-slide-up space-y-3">
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { onSend(s); setValue(""); }}
              className="px-3 py-1.5 rounded-full text-sm bg-surface-light text-[#e4e4ed] border border-white/10 hover:border-accent-indigo hover:text-accent-indigo transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          placeholder={placeholder}
          className="flex-1 rounded-xl bg-surface-light border border-white/10 px-4 py-3 text-[#e4e4ed] placeholder-white/40 focus:outline-none focus:border-accent-indigo transition-colors"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="px-5 py-3 rounded-xl bg-accent-indigo text-white font-medium hover:bg-accent-indigo/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
