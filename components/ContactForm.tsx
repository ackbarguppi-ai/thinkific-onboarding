"use client";

import { useState } from "react";

interface ContactFormProps {
  onSubmit: (data: { name: string; email: string; company: string }) => void;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const isValid = name.trim() && email.trim() && company.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ name: name.trim(), email: email.trim(), company: company.trim() });
  };

  const inputClass =
    "w-full rounded-xl bg-surface-light border border-white/10 px-4 py-3 text-[#e4e4ed] placeholder-white/40 focus:outline-none focus:border-accent-indigo transition-colors";

  return (
    <form onSubmit={handleSubmit} className="animate-fade-slide-up space-y-3">
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputClass}
        required
      />
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClass}
        required
      />
      <input
        type="text"
        placeholder="Company name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className={inputClass}
        required
      />
      <button
        type="submit"
        disabled={!isValid}
        className="w-full px-5 py-3 rounded-xl bg-accent-indigo text-white font-semibold hover:bg-accent-indigo/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Submit
      </button>
    </form>
  );
}
