"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage, { TypingIndicator } from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChoiceButtons from "./ChoiceButtons";
import CheckboxGroup from "./CheckboxGroup";
import PriorityRanker from "./PriorityRanker";
import ContactForm from "./ContactForm";
import Summary from "./Summary";
import { OnboardingData, saveOnboardingResponse } from "@/lib/actions";

type MessageRole = "assistant" | "user";

interface Message {
  id: number;
  role: MessageRole;
  content: string;
}

type InputType =
  | { kind: "none" }
  | { kind: "choice"; options: string[] }
  | { kind: "text"; suggestions?: string[]; placeholder?: string }
  | { kind: "checkbox"; options: string[] }
  | { kind: "ranker"; options: string[] }
  | { kind: "contact" }
  | { kind: "summary" };

export default function OnboardingChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<InputType>({ kind: "none" });
  const [typing, setTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  // Accumulated answers
  const answersRef = useRef<Partial<OnboardingData>>({});
  // Track sub-step for branching questions
  const subStepRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  const addMessage = useCallback(
    (role: MessageRole, content: string) => {
      const id = ++idRef.current;
      setMessages((prev) => [...prev, { id, role, content }]);
      scrollToBottom();
      return id;
    },
    [scrollToBottom]
  );

  const showTypingThenMessage = useCallback(
    (content: string, delayMs = 800): Promise<void> => {
      return new Promise((resolve) => {
        setTyping(true);
        scrollToBottom();
        setTimeout(() => {
          setTyping(false);
          addMessage("assistant", content);
          resolve();
        }, delayMs);
      });
    },
    [addMessage, scrollToBottom]
  );

  // Step handler
  const advanceStep = useCallback(
    async (stepNum: number) => {
      switch (stepNum) {
        case 1: {
          await showTypingThenMessage(
            "Hi! I'm here to help you get the most out of Thinkific. Let me ask a few quick questions so I can personalize your experience."
          );
          setCurrentStep(2);
          setStep(2);
          advanceStep(2);
          break;
        }
        case 2: {
          await showTypingThenMessage("What do you plan to use Thinkific for?");
          setInput({
            kind: "choice",
            options: [
              "Sell courses/memberships",
              "Customer training",
              "Employee training",
              "Certification programs",
              "Branded academy",
              "Other",
            ],
          });
          break;
        }
        case 3: {
          await showTypingThenMessage("Who will you be teaching?");
          setInput({
            kind: "text",
            suggestions: ["Customers", "Students", "Employees", "Partners", "General public"],
            placeholder: "Type your audience...",
          });
          break;
        }
        case 4: {
          await showTypingThenMessage("Do you plan to charge for your learning products?");
          setInput({
            kind: "choice",
            options: ["Yes (paid courses)", "Free courses only", "Mix of both", "Not sure yet"],
          });
          break;
        }
        case 5: {
          if (subStepRef.current === 0) {
            await showTypingThenMessage("Are you currently using another platform?");
            setInput({ kind: "choice", options: ["Yes", "No", "I have content but no platform"] });
          } else if (subStepRef.current === 1) {
            // "Yes" path — ask which platform
            await showTypingThenMessage("Which platform are you currently using?");
            setInput({ kind: "text", placeholder: "e.g. Teachable, Kajabi, Docebo..." });
          } else if (subStepRef.current === 2) {
            // After naming platform — migration offer
            await showTypingThenMessage(
              "Would you like help migrating? We can make that easy."
            );
            setInput({ kind: "choice", options: ["Yes, I'd like help", "No thanks, I'll handle it"] });
          } else if (subStepRef.current === 3) {
            // "I have content but no platform" — ask format
            await showTypingThenMessage("What format is your content in?");
            setInput({ kind: "text", placeholder: "e.g. Videos, PDFs, Google Docs..." });
          }
          break;
        }
        case 6: {
          await showTypingThenMessage("How many learners do you expect?");
          setInput({
            kind: "choice",
            options: ["Under 100", "100-1,000", "1,000-10,000", "10,000+", "Not sure"],
          });
          break;
        }
        case 7: {
          await showTypingThenMessage("What size is your organization?");
          setInput({
            kind: "choice",
            options: ["Just me", "2-10", "11-50", "51-200", "200+"],
          });
          break;
        }
        case 8: {
          if (subStepRef.current === 0) {
            await showTypingThenMessage("What matters most to you? (select all that apply)");
            setInput({
              kind: "checkbox",
              options: [
                "Easy to use",
                "Branded experience",
                "AI features",
                "Analytics & reporting",
                "Community features",
                "Commerce & payments",
                "Integrations",
                "Certificates",
                "Mobile learning",
                "Support & services",
              ],
            });
          } else {
            await showTypingThenMessage("Rank your top 3 if you can:");
            setInput({ kind: "ranker", options: answersRef.current.priorities || [] });
          }
          break;
        }
        case 9: {
          await showTypingThenMessage(
            "Almost done! Where should we send your personalized setup guide?"
          );
          setInput({ kind: "contact" });
          break;
        }
        case 10: {
          await showTypingThenMessage("Here's a summary of everything you shared:");
          setInput({ kind: "summary" });
          break;
        }
      }
    },
    [showTypingThenMessage]
  );

  // Handle user responses
  const handleUserResponse = useCallback(
    async (value: string | string[] | { name: string; email: string; company: string }) => {
      setInput({ kind: "none" });

      switch (step) {
        case 2: {
          const val = value as string;
          addMessage("user", val);
          answersRef.current.use_case = val;
          await showTypingThenMessage("Great choice! Thinkific is built for exactly that.", 600);
          setCurrentStep(3);
          setStep(3);
          advanceStep(3);
          break;
        }
        case 3: {
          const val = value as string;
          addMessage("user", val);
          answersRef.current.teaching_audience = val;
          setCurrentStep(4);
          setStep(4);
          advanceStep(4);
          break;
        }
        case 4: {
          const val = value as string;
          addMessage("user", val);
          answersRef.current.monetization = val;
          if (val === "Yes (paid courses)") {
            await showTypingThenMessage(
              "Nice! Thinkific has powerful commerce tools to help you monetize.",
              600
            );
          }
          setCurrentStep(5);
          setStep(5);
          subStepRef.current = 0;
          advanceStep(5);
          break;
        }
        case 5: {
          const val = value as string;
          addMessage("user", val);

          if (subStepRef.current === 0) {
            if (val === "Yes") {
              subStepRef.current = 1;
              advanceStep(5);
            } else if (val === "I have content but no platform") {
              answersRef.current.current_platform = null;
              subStepRef.current = 3;
              advanceStep(5);
            } else {
              // "No"
              answersRef.current.current_platform = null;
              answersRef.current.migration_interest = null;
              setCurrentStep(6);
              setStep(6);
              advanceStep(6);
            }
          } else if (subStepRef.current === 1) {
            // User named their platform
            answersRef.current.current_platform = val;
            subStepRef.current = 2;
            advanceStep(5);
          } else if (subStepRef.current === 2) {
            // Migration interest response
            answersRef.current.migration_interest = val.toLowerCase().includes("yes");
            setCurrentStep(6);
            setStep(6);
            advanceStep(6);
          } else if (subStepRef.current === 3) {
            // Content format
            answersRef.current.content_format = val;
            setCurrentStep(6);
            setStep(6);
            advanceStep(6);
          }
          break;
        }
        case 6: {
          const val = value as string;
          addMessage("user", val);
          answersRef.current.expected_learners = val;
          setCurrentStep(7);
          setStep(7);
          advanceStep(7);
          break;
        }
        case 7: {
          const val = value as string;
          addMessage("user", val);
          answersRef.current.org_size = val;
          setCurrentStep(8);
          setStep(8);
          subStepRef.current = 0;
          advanceStep(8);
          break;
        }
        case 8: {
          if (subStepRef.current === 0) {
            const vals = value as string[];
            addMessage("user", vals.join(", "));
            answersRef.current.priorities = vals;
            subStepRef.current = 1;
            advanceStep(8);
          } else {
            const vals = value as string[];
            addMessage("user", `Top 3: ${vals.join(", ")}`);
            answersRef.current.priority_ranking = vals;
            setCurrentStep(9);
            setStep(9);
            advanceStep(9);
          }
          break;
        }
        case 9: {
          const contact = value as { name: string; email: string; company: string };
          addMessage("user", `${contact.name} — ${contact.email} — ${contact.company}`);
          answersRef.current.name = contact.name;
          answersRef.current.email = contact.email;
          answersRef.current.company = contact.company;

          // Save to Supabase
          const data = answersRef.current as OnboardingData;
          try {
            await saveOnboardingResponse(data);
          } catch {
            // continue even if save fails
          }
          setCurrentStep(10);
          setStep(10);
          advanceStep(10);
          break;
        }
      }
    },
    [step, addMessage, showTypingThenMessage, advanceStep]
  );

  // Kick off the conversation
  useEffect(() => {
    if (step === 0) {
      setStep(1);
      setCurrentStep(1);
      advanceStep(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto w-full">
      {/* Progress bar */}
      <div className="sticky top-0 z-10 bg-[#0a0a0f]/90 backdrop-blur-sm border-b border-white/5 px-4 py-3">
        <div className="flex items-center justify-between text-xs text-white/50 mb-2">
          <span>Step {Math.min(currentStep, 10)} of 10</span>
          <span className="text-accent-teal font-medium">Thinkific Onboarding</span>
        </div>
        <div className="h-1 rounded-full bg-surface-light overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-indigo to-accent-teal transition-all duration-500"
            style={{ width: `${(Math.min(currentStep, 10) / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role}>
            {msg.content}
          </ChatMessage>
        ))}

        {typing && <TypingIndicator />}

        {/* Interactive input area */}
        {input.kind === "choice" && (
          <ChoiceButtons
            options={input.options}
            onSelect={(val) => handleUserResponse(val)}
          />
        )}
        {input.kind === "text" && (
          <ChatInput
            onSend={(val) => handleUserResponse(val)}
            suggestions={input.suggestions}
            placeholder={input.placeholder}
          />
        )}
        {input.kind === "checkbox" && (
          <CheckboxGroup
            options={input.options}
            onSubmit={(vals) => handleUserResponse(vals)}
          />
        )}
        {input.kind === "ranker" && (
          <PriorityRanker
            options={input.options}
            onSubmit={(vals) => handleUserResponse(vals)}
          />
        )}
        {input.kind === "contact" && (
          <ContactForm
            onSubmit={(data) => handleUserResponse(data)}
          />
        )}
        {input.kind === "summary" && (
          <Summary data={answersRef.current as OnboardingData} />
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
