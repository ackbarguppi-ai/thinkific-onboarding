"use client";

import { useState } from "react";

interface PriorityRankerProps {
  options: string[];
  onSubmit: (ranked: string[]) => void;
}

export default function PriorityRanker({ options, onSubmit }: PriorityRankerProps) {
  const [ranked, setRanked] = useState<string[]>([]);

  const toggleRank = (option: string) => {
    setRanked((prev) => {
      if (prev.includes(option)) return prev.filter((o) => o !== option);
      if (prev.length >= 3) return prev;
      return [...prev, option];
    });
  };

  const getRank = (option: string) => {
    const idx = ranked.indexOf(option);
    return idx === -1 ? null : idx + 1;
  };

  return (
    <div className="animate-fade-slide-up space-y-3">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const rank = getRank(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleRank(option)}
              className={`relative px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                rank
                  ? "bg-accent-indigo/15 border-accent-indigo text-accent-indigo"
                  : ranked.length >= 3
                  ? "bg-surface-light border-white/5 text-white/30 cursor-not-allowed"
                  : "bg-surface-light border-white/10 text-[#e4e4ed] hover:border-accent-indigo/50"
              }`}
            >
              {rank && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent-indigo text-white text-xs flex items-center justify-center font-bold">
                  {rank}
                </span>
              )}
              {option}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-white/50">
        {ranked.length}/3 selected — click to select your top priorities in order
      </p>
      <button
        type="button"
        onClick={() => { if (ranked.length > 0) onSubmit(ranked); }}
        disabled={ranked.length === 0}
        className="px-5 py-2.5 rounded-xl bg-accent-indigo text-white font-medium hover:bg-accent-indigo/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Continue
      </button>
    </div>
  );
}
