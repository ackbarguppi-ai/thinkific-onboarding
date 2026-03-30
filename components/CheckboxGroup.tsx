"use client";

import { useState } from "react";

interface CheckboxGroupProps {
  options: string[];
  onSubmit: (selected: string[]) => void;
}

export default function CheckboxGroup({ options, onSubmit }: CheckboxGroupProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (option: string) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  return (
    <div className="animate-fade-slide-up space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const isChecked = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left border transition-all ${
                isChecked
                  ? "bg-accent-indigo/15 border-accent-indigo text-accent-indigo"
                  : "bg-surface-light border-white/10 text-[#e4e4ed] hover:border-white/20"
              }`}
            >
              <span
                className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center text-xs ${
                  isChecked ? "bg-accent-indigo border-accent-indigo text-white" : "border-white/30"
                }`}
              >
                {isChecked && "✓"}
              </span>
              {option}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => { if (selected.length > 0) onSubmit(selected); }}
        disabled={selected.length === 0}
        className="px-5 py-2.5 rounded-xl bg-accent-indigo text-white font-medium hover:bg-accent-indigo/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Continue ({selected.length} selected)
      </button>
    </div>
  );
}
