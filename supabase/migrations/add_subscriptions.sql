-- PravnaAI Subscription System Migration
-- Run this in Supabase SQL Editor after the initial migration

-- ============================================
-- 1. SUBSCRIPTION PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,                     -- 'free', 'basic', 'professional'
  display_name TEXT NOT NULL,                    -- 'Brezplačno', 'Osnovni', 'Profesionalni'
  stripe_price_id TEXT,                          -- Stripe price ID (null for free)
  queries_per_day INTEGER NOT NULL,              -- Daily query limit
  price_cents INTEGER NOT NULL DEFAULT 0,        -- Price in cents (EUR)
  features JSONB DEFAULT '[]'::jsonb,            -- Array of feature descriptions
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- 2. USER SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan_id UUID REFERENCES public.subscription_plans(id) NOT NULL,
  stripe_customer_id TEXT,                       -- Stripe customer ID
  stripe_subscription_id TEXT,                   -- Stripe subscription ID
  status TEXT NOT NULL DEFAULT 'active',         -- 'active', 'canceled', 'past_due', 'trialing'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- 3. DAILY USAGE TRACKING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.daily_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  query_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, usage_date)
);

-- ============================================
-- 4. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON public.daily_usage(user_id, usage_date);

-- ============================================
-- 5. ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;

-- Plans are viewable by everyone (public pricing)
CREATE POLICY "Plans are viewable by everyone"
  ON public.subscription_plans FOR SELECT
  USING (is_active = true);

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view their own usage
CREATE POLICY "Users can view own usage"
  ON public.daily_usage FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- 6. DATABASE FUNCTIONS
-- ============================================

-- Function to get user's daily query limit
CREATE OR REPLACE FUNCTION public.get_user_daily_limit(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_daily_limit INTEGER;
BEGIN
  -- Get user's daily limit from their subscription plan
  SELECT sp.queries_per_day INTO v_daily_limit
  FROM public.subscriptions s
  JOIN public.subscription_plans sp ON s.plan_id = sp.id
  WHERE s.user_id = p_user_id
    AND s.status = 'active'
    AND (s.current_period_end IS NULL OR s.current_period_end > NOW());

  -- Default to free tier if no active subscription
  IF v_daily_limit IS NULL THEN
    SELECT queries_per_day INTO v_daily_limit
    FROM public.subscription_plans
    WHERE name = 'free';
  END IF;

  RETURN COALESCE(v_daily_limit, 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can make a query
CREATE OR REPLACE FUNCTION public.can_user_query(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_daily_limit INTEGER;
  v_current_usage INTEGER;
BEGIN
  -- Get user's daily limit
  v_daily_limit := public.get_user_daily_limit(p_user_id);

  -- Get current usage for today
  SELECT COALESCE(query_count, 0) INTO v_current_usage
  FROM public.daily_usage
  WHERE user_id = p_user_id AND usage_date = CURRENT_DATE;

  RETURN COALESCE(v_current_usage, 0) < v_daily_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment user's daily usage
CREATE OR REPLACE FUNCTION public.increment_user_usage(p_user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO public.daily_usage (user_id, usage_date, query_count)
  VALUES (p_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, usage_date)
  DO UPDATE SET
    query_count = public.daily_usage.query_count + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get remaining queries for today
CREATE OR REPLACE FUNCTION public.get_remaining_queries(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_daily_limit INTEGER;
  v_current_usage INTEGER;
BEGIN
  -- Get user's daily limit
  v_daily_limit := public.get_user_daily_limit(p_user_id);

  -- Get current usage
  SELECT COALESCE(query_count, 0) INTO v_current_usage
  FROM public.daily_usage
  WHERE user_id = p_user_id AND usage_date = CURRENT_DATE;

  RETURN GREATEST(0, v_daily_limit - COALESCE(v_current_usage, 0));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. TRIGGERS
-- ============================================

-- Update updated_at on subscriptions
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Update updated_at on daily_usage
CREATE TRIGGER update_daily_usage_updated_at
  BEFORE UPDATE ON public.daily_usage
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- 8. SEED DATA - Subscription Plans
-- ============================================
INSERT INTO public.subscription_plans (name, display_name, stripe_price_id, queries_per_day, price_cents, features, sort_order)
VALUES
  (
    'free',
    'Brezplačno',
    NULL,
    1,
    0,
    '["1 poizvedba na dan", "Osnovno pravno svetovanje", "Omejena zgodovina"]'::jsonb,
    0
  ),
  (
    'basic',
    'Osnovni',
    NULL, -- Add Stripe price ID after creating in Stripe Dashboard
    10,
    999,
    '["10 poizvedb na dan", "Celotna zgodovina", "Nalaganje dokumentov", "Email podpora"]'::jsonb,
    1
  ),
  (
    'professional',
    'Profesionalni',
    NULL, -- Add Stripe price ID after creating in Stripe Dashboard
    50,
    2999,
    '["50 poizvedb na dan", "Vse funkcionalnosti Osnovnega paketa", "Prioritetna podpora", "Napredna pravna analiza"]'::jsonb,
    2
  )
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  queries_per_day = EXCLUDED.queries_per_day,
  price_cents = EXCLUDED.price_cents,
  features = EXCLUDED.features,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();
