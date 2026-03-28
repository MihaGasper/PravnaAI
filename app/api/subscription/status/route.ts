import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Morate biti prijavljeni' },
        { status: 401 }
      )
    }

    // Get user's subscription with plan details
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('user_id', user.id)
      .single()

    // Get free plan as fallback
    const { data: freePlan } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('name', 'free')
      .single()

    // Get today's usage
    const today = new Date().toISOString().split('T')[0]
    const { data: usage } = await supabase
      .from('daily_usage')
      .select('query_count')
      .eq('user_id', user.id)
      .eq('usage_date', today)
      .single()

    // Get active query packs
    const { data: packs } = await supabase
      .from('query_packs')
      .select('queries_total, queries_used, expires_at')
      .eq('user_id', user.id)
      .gt('expires_at', new Date().toISOString())

    const packRemaining = (packs || []).reduce(
      (sum: number, p: any) => sum + Math.max(0, p.queries_total - p.queries_used),
      0
    )

    const plan = subscription?.plan || freePlan
    const dailyLimit = plan?.queries_per_day || 1
    const used = usage?.query_count || 0
    const dailyRemaining = Math.max(0, dailyLimit - used)
    const totalRemaining = dailyRemaining + packRemaining

    return NextResponse.json({
      subscription: subscription || null,
      plan: plan || freePlan,
      usage: {
        used,
        remaining: totalRemaining,
        limit: dailyLimit,
        canQuery: totalRemaining > 0,
      },
      queryPack: packRemaining > 0 ? {
        remaining: packRemaining,
        expiresAt: packs?.sort((a: any, b: any) =>
          new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime()
        )[0]?.expires_at,
      } : null,
    })
  } catch {
    return NextResponse.json(
      { error: 'Napaka pri pridobivanju statusa naročnine' },
      { status: 500 }
    )
  }
}
