export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing'

export interface SubscriptionPlan {
  id: string
  name: string
  display_name: string
  stripe_price_id: string | null
  queries_per_day: number
  price_cents: number
  features: string[]
  is_active: boolean
  sort_order: number
}

export interface UserSubscription {
  id: string
  user_id: string
  plan_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  status: SubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
  // Joined data
  plan?: SubscriptionPlan
}

export interface DailyUsage {
  id: string
  user_id: string
  usage_date: string
  query_count: number
  created_at: string
  updated_at: string
}

export interface QuotaStatus {
  canQuery: boolean
  remaining: number
  limit: number
  used: number
  planName: string
  planDisplayName: string
}
