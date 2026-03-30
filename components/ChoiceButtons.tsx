"use client";

import { useState } from "react";

interface ChoiceButtonsProps {
  options: string[];
  onSelect: (value: string) => void;
}

export default function ChoiceButtons({ options, onSelect }: ChoiceButtonsProps) {
  const [customText, setCustomText] = useState("");

  return (
    <div className="animate-fade-slide-up space-y-3">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-surface-light border border-white/10 text-[#e4e4ed] hover:border-accent-indigo hover:text-accent-indigo hover:bg-accent-indigo/10 transition-all"
          >
            {option}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && customText.trim()) {
              onSelect(customText.trim());
            }
          }}
          placeholder="Or type your own..."
          className="flex-1 rounded-xl bg-surface-light border border-white/10 px-3 py-2 text-sm text-[#e4e4ed] placeholder-white/40 focus:outline-none focus:border-accent-indigo transition-colors"
        />
        <button
          type="button"
          onClick={() => { if (customText.trim()) onSelect(customText.trim()); }}
          disabled={!customText.trim()}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-accent-indigo text-white hover:bg-accent-indigo/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
