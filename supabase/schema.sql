-- =============================================================================
-- RINGGER LAW (ringgerlaw.com) — SUPABASE POSTGRES SCHEMA & SEED DATA
-- Project URL: https://kufyxqggfzotrbckyzld.supabase.co
-- Copy & run this entire script in the Supabase SQL Editor
-- =============================================================================

-- 1. LEADS TABLE (CRM Pipeline & Triage)
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT DEFAULT '',
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  county TEXT NOT NULL DEFAULT 'Madison County (Jackson)',
  primary_concern TEXT NOT NULL,
  estimated_debt NUMERIC NOT NULL DEFAULT 25000,
  owns_home BOOLEAN NOT NULL DEFAULT FALSE,
  behind_on_payments BOOLEAN NOT NULL DEFAULT FALSE,
  urgency TEXT NOT NULL DEFAULT 'STANDARD_DEBT_RELIEF',
  recommended_chapter TEXT NOT NULL DEFAULT 'Chapter 7 ($0 Down Eligible)',
  source_page TEXT NOT NULL DEFAULT '/',
  capture_method TEXT NOT NULL DEFAULT 'Free Consultation Form',
  preferred_date TEXT DEFAULT '',
  preferred_time TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'NEW',
  estimated_case_value NUMERIC NOT NULL DEFAULT 1850,
  payload JSONB DEFAULT '{}'::jsonb
);

-- 2. INTAKES TABLE (5-Step Court Intake Questionnaires)
CREATE TABLE IF NOT EXISTS public.intakes (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  lead_id TEXT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  mailing_address TEXT DEFAULT '',
  birthday TEXT DEFAULT '',
  ssn_last4 TEXT DEFAULT '',
  marital_status TEXT DEFAULT 'Single',
  filing_with_spouse BOOLEAN DEFAULT FALSE,
  debtor_signature TEXT NOT NULL,
  signature_date TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Enable Row Level Security (RLS) with public insert/select policies for API usage
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intakes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow full access to leads" ON public.leads;
CREATE POLICY "Allow full access to leads"
  ON public.leads
  FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access to intakes" ON public.intakes;
CREATE POLICY "Allow full access to intakes"
  ON public.intakes
  FOR ALL
  USING (true)
  WITH CHECK (true);
