ALTER TABLE onboarding_responses
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS book_call BOOLEAN;
