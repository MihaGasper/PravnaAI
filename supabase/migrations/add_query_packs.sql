-- ============================================
-- Query Packs — one-time purchase (5 queries / 24h)
-- ============================================

CREATE TABLE IF NOT EXISTS public.query_packs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  queries_total INTEGER NOT NULL DEFAULT 5,
  queries_used INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_query_packs_user ON public.query_packs(user_id, expires_at);

-- RLS
ALTER TABLE public.query_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own packs"
  ON public.query_packs FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- Update can_user_query to check packs too
-- ============================================
CREATE OR REPLACE FUNCTION public.can_user_query(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_daily_limit INTEGER;
  v_current_usage INTEGER;
  v_pack_remaining INTEGER;
BEGIN
  -- Check active query packs first
  SELECT COALESCE(SUM(queries_total - queries_used), 0) INTO v_pack_remaining
  FROM public.query_packs
  WHERE user_id = p_user_id
    AND expires_at > NOW()
    AND queries_used < queries_total;

  IF v_pack_remaining > 0 THEN
    RETURN TRUE;
  END IF;

  -- Fall back to subscription daily limit
  v_daily_limit := public.get_user_daily_limit(p_user_id);

  SELECT COALESCE(query_count, 0) INTO v_current_usage
  FROM public.daily_usage
  WHERE user_id = p_user_id AND usage_date = CURRENT_DATE;

  RETURN COALESCE(v_current_usage, 0) < v_daily_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Update get_remaining_queries to include packs
-- ============================================
CREATE OR REPLACE FUNCTION public.get_remaining_queries(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_daily_limit INTEGER;
  v_current_usage INTEGER;
  v_pack_remaining INTEGER;
  v_daily_remaining INTEGER;
BEGIN
  -- Pack queries
  SELECT COALESCE(SUM(queries_total - queries_used), 0) INTO v_pack_remaining
  FROM public.query_packs
  WHERE user_id = p_user_id
    AND expires_at > NOW()
    AND queries_used < queries_total;

  -- Daily limit queries
  v_daily_limit := public.get_user_daily_limit(p_user_id);
  SELECT COALESCE(query_count, 0) INTO v_current_usage
  FROM public.daily_usage
  WHERE user_id = p_user_id AND usage_date = CURRENT_DATE;

  v_daily_remaining := GREATEST(0, v_daily_limit - COALESCE(v_current_usage, 0));

  RETURN v_pack_remaining + v_daily_remaining;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Update increment_user_usage to use packs first
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_user_usage(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_pack_id UUID;
  v_daily_limit INTEGER;
  v_current_usage INTEGER;
BEGIN
  -- Try to use a query pack first (only if daily limit is exhausted)
  v_daily_limit := public.get_user_daily_limit(p_user_id);
  SELECT COALESCE(query_count, 0) INTO v_current_usage
  FROM public.daily_usage
  WHERE user_id = p_user_id AND usage_date = CURRENT_DATE;

  IF COALESCE(v_current_usage, 0) >= v_daily_limit THEN
    -- Daily limit exhausted, use pack
    SELECT id INTO v_pack_id
    FROM public.query_packs
    WHERE user_id = p_user_id
      AND expires_at > NOW()
      AND queries_used < queries_total
    ORDER BY expires_at ASC
    LIMIT 1;

    IF v_pack_id IS NOT NULL THEN
      UPDATE public.query_packs
      SET queries_used = queries_used + 1
      WHERE id = v_pack_id;
      RETURN;
    END IF;
  END IF;

  -- Use daily quota
  INSERT INTO public.daily_usage (user_id, usage_date, query_count)
  VALUES (p_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, usage_date)
  DO UPDATE SET
    query_count = public.daily_usage.query_count + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
