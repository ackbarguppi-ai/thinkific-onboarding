"use client";

interface ChoiceButtonsProps {
  options: string[];
  onSelect: (value: string) => void;
}

export default function ChoiceButtons({ options, onSelect }: ChoiceButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 animate-fade-slide-up">
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
  );
}
