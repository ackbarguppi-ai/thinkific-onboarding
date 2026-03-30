import { supabase } from "./supabase";

export interface OnboardingData {
  use_case: string;
  teaching_audience: string;
  monetization: string;
  current_platform: string | null;
  migration_interest: boolean | null;
  content_format: string | null;
  expected_learners: string;
  org_size: string;
  priorities: string[];
  priority_ranking: string[];
  name: string;
  email: string;
  company: string;
}

const ENTERPRISE_PLATFORMS = [
  "docebo", "absorb", "cornerstone", "saba", "oracle", "sap", "skillsoft", "moodle enterprise",
];

export function computeIsPlusLead(data: OnboardingData): boolean {
  if (
    data.expected_learners === "1,000-10,000" ||
    data.expected_learners === "10,000+"
  )
    return true;
  if (data.org_size === "51-200" || data.org_size === "200+") return true;
  if (
    data.use_case === "Customer training" ||
    data.use_case === "Certification programs"
  )
    return true;
  if (data.current_platform) {
    const lower = data.current_platform.toLowerCase();
    if (ENTERPRISE_PLATFORMS.some((p) => lower.includes(p))) return true;
  }
  return false;
}

export async function saveOnboardingResponse(data: OnboardingData) {
  const is_plus_lead = computeIsPlusLead(data);
  const { error } = await supabase
    .from("onboarding_responses")
    .insert({ ...data, is_plus_lead });
  if (error) {
    console.error("Supabase insert error:", error);
    throw error;
  }
  return { is_plus_lead };
}
