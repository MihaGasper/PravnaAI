import { createServiceClient } from '@/lib/supabase/server'
import type { QuotaStatus } from './types'

/**
 * Check if user can make a query based on their subscription plan and daily usage
 */
export async function checkUserQuota(userId: string): Promise<QuotaStatus> {
  const supabase = await createServiceClient()

  // Get user's subscription with plan details
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select(`
      *,
      plan:subscription_plans(*)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  // Get free plan as fallback
  const { data: freePlan } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('name', 'free')
    .single()

  const plan = subscription?.plan || freePlan
  const dailyLimit = plan?.queries_per_day || 1

  // Get today's usage
  const today = new Date().toISOString().split('T')[0]
  const { data: usage } = await supabase
    .from('daily_usage')
    .select('query_count')
    .eq('user_id', userId)
    .eq('usage_date', today)
    .single()

  const used = usage?.query_count || 0
  const remaining = Math.max(0, dailyLimit - used)
  const canQuery = remaining > 0

  return {
    canQuery,
    remaining,
    limit: dailyLimit,
    used,
    planName: plan?.name || 'free',
    planDisplayName: plan?.display_name || 'Brezplačno',
  }
}

/**
 * Increment user's daily usage count
 */
export async function incrementUsage(userId: string): Promise<void> {
  const supabase = await createServiceClient()

  const today = new Date().toISOString().split('T')[0]

  // Upsert: insert or increment
  const { data: existing } = await supabase
    .from('daily_usage')
    .select('id, query_count')
    .eq('user_id', userId)
    .eq('usage_date', today)
    .single()

  if (existing) {
    await supabase
      .from('daily_usage')
      .update({ query_count: existing.query_count + 1 })
      .eq('id', existing.id)
  } else {
    await supabase
      .from('daily_usage')
      .insert({
        user_id: userId,
        usage_date: today,
        query_count: 1,
      })
  }
}

/**
 * Get user's subscription details
 */
export async function getUserSubscription(userId: string) {
  const supabase = await createServiceClient()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select(`
      *,
      plan:subscription_plans(*)
    `)
    .eq('user_id', userId)
    .single()

  return subscription
}

/**
 * Get all available subscription plans
 */
export async function getSubscriptionPlans() {
  const supabase = await createServiceClient()

  const { data: plans } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  return plans || []
}
