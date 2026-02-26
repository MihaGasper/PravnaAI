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
  console.log('=== STRIPE WEBHOOK START ===')

  let body: string
  let signature: string | null

  try {
    body = await request.text()
    signature = request.headers.get('stripe-signature')
    console.log('Got body and signature')
  } catch (err) {
    console.error('Failed to read request:', err)
    return NextResponse.json({ error: 'Failed to read request' }, { status: 400 })
  }

  if (!signature) {
    console.error('Missing stripe-signature header')
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
    console.log('Signature verified, event type:', event.type)
  } catch (err) {
    console.error('Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    try {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('Processing checkout session:', session.id)

      // Only handle subscription mode
      if (session.mode !== 'subscription') {
        console.log('Not a subscription, skipping')
        return NextResponse.json({ received: true })
      }

      const userId = session.metadata?.user_id
      if (!userId) {
        console.error('No user_id in metadata')
        return NextResponse.json({ received: true }) // Don't fail, just skip
      }

      const subscriptionId = session.subscription as string
      const customerId = session.customer as string

      console.log('User:', userId)
      console.log('Subscription:', subscriptionId)
      console.log('Customer:', customerId)

      // Get subscription details from Stripe
      let subscription: Stripe.Subscription
      try {
        subscription = await stripe.subscriptions.retrieve(subscriptionId)
        console.log('Retrieved subscription from Stripe')
      } catch (err) {
        console.error('Failed to retrieve subscription:', err)
        return NextResponse.json({ error: 'Failed to get subscription' }, { status: 500 })
      }

      const priceId = subscription.items.data[0]?.price.id
      console.log('Price ID:', priceId)

      // Find matching plan in database
      const { data: plan, error: planError } = await supabase
        .from('subscription_plans')
        .select('id, name')
        .eq('stripe_price_id', priceId)
        .single()

      if (planError || !plan) {
        console.error('Plan lookup failed:', planError)
        console.error('Price ID not found:', priceId)
        // Return success anyway - don't block Stripe
        return NextResponse.json({ received: true, warning: 'Plan not found' })
      }

      console.log('Found plan:', plan.name, plan.id)

      // Prepare subscription data
      const subscriptionData = {
        user_id: userId,
        plan_id: plan.id,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        status: 'active',
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      }

      console.log('Upserting:', JSON.stringify(subscriptionData))

      // Insert or update subscription
      const { error: upsertError } = await supabase
        .from('subscriptions')
        .upsert(subscriptionData, { onConflict: 'user_id' })

      if (upsertError) {
        console.error('Upsert failed:', upsertError)
        return NextResponse.json({ error: 'Database error', details: upsertError.message }, { status: 500 })
      }

      console.log('=== SUBSCRIPTION SAVED SUCCESSFULLY ===')

    } catch (err) {
      console.error('Checkout handler error:', err)
      return NextResponse.json({
        error: 'Handler failed',
        details: err instanceof Error ? err.message : 'Unknown error'
      }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
