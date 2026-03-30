"use client";

import { OnboardingData, computeIsPlusLead } from "@/lib/actions";

interface SummaryProps {
  data: OnboardingData;
}

function getRecommendation(data: OnboardingData): string {
  const isPlusLead = computeIsPlusLead(data);
  if (isPlusLead) {
    return "Based on your needs, Thinkific Plus would be the perfect fit. It offers advanced features for larger organizations including dedicated support, custom integrations, and enterprise-grade security.";
  }
  if (data.monetization === "Free courses only") {
    return "Thinkific's free plan is a great starting point! You can create and deliver courses at no cost, and upgrade anytime as you grow.";
  }
  if (data.use_case === "Branded academy") {
    return "Thinkific is perfect for building your branded academy. With custom domains, white-labeling, and powerful design tools, your brand will shine.";
  }
  return "Thinkific has everything you need to create, market, and sell your online learning products. Let's get you started!";
}

export default function Summary({ data }: SummaryProps) {
  const recommendation = getRecommendation(data);

  const rows: { label: string; value: string | null }[] = [
    { label: "Use case", value: data.use_case },
    { label: "Teaching audience", value: data.teaching_audience },
    { label: "Monetization", value: data.monetization },
    { label: "Current platform", value: data.current_platform },
    { label: "Content format", value: data.content_format },
    { label: "Expected learners", value: data.expected_learners },
    { label: "Organization size", value: data.org_size },
    { label: "Top priorities", value: data.priority_ranking.join(", ") },
    { label: "All priorities", value: data.priorities.join(", ") },
    { label: "Name", value: data.name },
    { label: "Email", value: data.email },
    { label: "Company", value: data.company },
  ];

  return (
    <div className="animate-fade-slide-up space-y-5">
      <div className="rounded-2xl bg-surface-light border border-white/10 p-5 space-y-3">
        <h3 className="text-lg font-semibold text-accent-teal">Your Onboarding Summary</h3>
        <div className="space-y-2">
          {rows
            .filter((r) => r.value)
            .map((r) => (
              <div key={r.label} className="flex justify-between gap-4 text-sm">
                <span className="text-white/50 flex-shrink-0">{r.label}</span>
                <span className="text-right">{r.value}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="rounded-2xl bg-accent-indigo/10 border border-accent-indigo/30 p-5">
        <p className="text-sm leading-relaxed">{recommendation}</p>
      </div>

      <a
        href="https://www.thinkific.com/start"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center px-6 py-4 rounded-xl bg-accent-teal text-[#0a0a0f] font-bold text-lg hover:bg-accent-teal/90 transition-colors"
      >
        Start your free trial →
      </a>
    </div>
  );
}
