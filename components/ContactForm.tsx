"use client";

import { useState, useEffect, useCallback } from "react";

interface ContactFormProps {
  onSubmit: (data: { name: string; email: string; company: string; phone_number: string; book_call: boolean }) => void;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showBookCall, setShowBookCall] = useState(false);
  const [bookCallAnswer, setBookCallAnswer] = useState<boolean | null>(null);

  const isValid = name.trim() && email.trim() && company.trim();

  const doSubmit = useCallback((bookCall: boolean) => {
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      phone_number: phoneNumber.trim(),
      book_call: bookCall,
    });
  }, [onSubmit, name, email, company, phoneNumber]);

  // Auto-submit after showing the "Great!" message
  useEffect(() => {
    if (bookCallAnswer === true) {
      const timer = setTimeout(() => doSubmit(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [bookCallAnswer, doSubmit]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setShowBookCall(true);
  };

  const handleBookCallAnswer = (answer: boolean) => {
    setBookCallAnswer(answer);
    if (!answer) {
      doSubmit(false);
    }
  };

  const inputClass =
    "w-full rounded-xl bg-surface-light border border-white/10 px-4 py-3 text-[#e4e4ed] placeholder-white/40 focus:outline-none focus:border-accent-indigo transition-colors";

  if (showBookCall) {
    return (
      <div className="animate-fade-slide-up space-y-3">
        {bookCallAnswer === null ? (
          <>
            <p className="text-sm text-[#e4e4ed]">
              Would you like to book a call to answer any questions you have?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleBookCallAnswer(true)}
                className="px-5 py-2.5 rounded-xl bg-accent-indigo text-white font-medium hover:bg-accent-indigo/80 transition-colors"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => handleBookCallAnswer(false)}
                className="px-5 py-2.5 rounded-xl bg-surface-light border border-white/10 text-[#e4e4ed] font-medium hover:border-white/20 transition-colors"
              >
                No
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-accent-teal">
            Great! Our team will reach out to schedule a time that works for you.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleContinue} className="animate-fade-slide-up space-y-3">
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
      <input
        type="tel"
        placeholder="Phone number (optional)"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className={inputClass}
      />
      <button
        type="submit"
        disabled={!isValid}
        className="w-full px-5 py-3 rounded-xl bg-accent-indigo text-white font-semibold hover:bg-accent-indigo/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Continue
      </button>
    </form>
  );
}
