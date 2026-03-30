import { createClient } from "@supabase/supabase-js";

/*
SQL to create the onboarding_responses table in Supabase:

CREATE TABLE onboarding_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  use_case TEXT NOT NULL,
  teaching_audience TEXT NOT NULL,
  monetization TEXT NOT NULL,
  current_platform TEXT,
  migration_interest BOOLEAN,
  content_format TEXT,
  expected_learners TEXT NOT NULL,
  org_size TEXT NOT NULL,
  priorities JSONB NOT NULL,
  priority_ranking JSONB NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  is_plus_lead BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anon key
CREATE POLICY "Allow anonymous inserts" ON onboarding_responses
  FOR INSERT WITH CHECK (true);
*/

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
