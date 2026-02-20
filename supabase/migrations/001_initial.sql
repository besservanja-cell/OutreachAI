-- OutreachAI: Initial schema with RLS policies
-- Run this migration in Supabase SQL Editor or via supabase db push

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users for app-specific data)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro')),
  credits_used INT NOT NULL DEFAULT 0,
  credits_limit INT NOT NULL DEFAULT 5,
  ls_customer_id TEXT,
  ls_subscription_id TEXT,
  subscription_status TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Emails table (generation history)
CREATE TABLE IF NOT EXISTS public.emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  prospect_name TEXT NOT NULL,
  prospect_company TEXT NOT NULL,
  industry TEXT NOT NULL,
  tone TEXT NOT NULL,
  variants_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_ls_customer_id ON public.users(ls_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_ls_subscription_id ON public.users(ls_subscription_id);
CREATE INDEX IF NOT EXISTS idx_emails_user_id ON public.emails(user_id);
CREATE INDEX IF NOT EXISTS idx_emails_created_at ON public.emails(user_id, created_at DESC);

-- Enable RLS on both tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

-- Users RLS policies
CREATE POLICY "Users can read own row"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own row"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role can do everything on users"
  ON public.users FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Emails RLS policies
CREATE POLICY "Users can read own emails"
  ON public.emails FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emails"
  ON public.emails FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can do everything on emails"
  ON public.emails FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Function to auto-create user row on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, plan, credits_limit)
  VALUES (NEW.id, 'free', 5)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
