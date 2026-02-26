import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Create Supabase admin client (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  let body: string
  let signature: string | null

  try {
    body = await request.text()
    signature = request.headers.get('stripe-signature')
  } catch {
    return NextResponse.json({ error: 'Failed to read request' }, { status: 400 })
  }

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  // Verify webhook signature
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    try {
      const session = event.data.object as Stripe.Checkout.Session

      // Only handle subscription mode
      if (session.mode !== 'subscription') {
        return NextResponse.json({ received: true })
      }

      const userId = session.metadata?.user_id
      if (!userId) {
        return NextResponse.json({ received: true })
      }

      const subscriptionId = session.subscription as string
      const customerId = session.customer as string

      // Get subscription details from Stripe
      let subscription: Stripe.Subscription
      try {
        subscription = await stripe.subscriptions.retrieve(subscriptionId)
      } catch {
        return NextResponse.json({ error: 'Failed to get subscription' }, { status: 500 })
      }

      const priceId = subscription.items.data[0]?.price.id

      // Find matching plan in database
      const { data: plan, error: planError } = await supabase
        .from('subscription_plans')
        .select('id, name')
        .eq('stripe_price_id', priceId)
        .single()

      if (planError || !plan) {
        return NextResponse.json({ received: true, warning: 'Plan not found' })
      }

      // Prepare subscription data with safe date handling
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subData = subscription as any
      const periodStart = subData.current_period_start
        ? new Date(subData.current_period_start * 1000).toISOString()
        : new Date().toISOString()

      const periodEnd = subData.current_period_end
        ? new Date(subData.current_period_end * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

      const subscriptionData = {
        user_id: userId,
        plan_id: plan.id,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        status: 'active',
        current_period_start: periodStart,
        current_period_end: periodEnd,
        cancel_at_period_end: subscription.cancel_at_period_end ?? false,
      }

      // Insert or update subscription
      const { error: upsertError } = await supabase
        .from('subscriptions')
        .upsert(subscriptionData, { onConflict: 'user_id' })

      if (upsertError) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
      }

    } catch {
      return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
