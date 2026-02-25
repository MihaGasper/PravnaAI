import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  console.log('Webhook received:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Checkout session completed:', session.id)
        console.log('Session metadata:', session.metadata)
        console.log('Session mode:', session.mode)
        console.log('Session subscription:', session.subscription)

        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )
          console.log('Retrieved subscription:', subscription.id)

          const userId = session.metadata?.user_id
          if (!userId) {
            console.error('No user_id in session metadata')
            break
          }
          console.log('User ID:', userId)

          // Get the plan based on price ID
          const priceId = subscription.items.data[0]?.price.id
          console.log('Price ID:', priceId)

          const { data: plan, error: planError } = await supabase
            .from('subscription_plans')
            .select('id')
            .eq('stripe_price_id', priceId)
            .single()

          console.log('Plan lookup result:', { plan, planError })

          if (!plan) {
            console.error('No plan found for price:', priceId)
            break
          }

          // Upsert subscription
          const { data: upsertData, error: upsertError } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              plan_id: plan.id,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscription.id,
              status: 'active',
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            }, {
              onConflict: 'user_id'
            })
            .select()

          console.log('Upsert result:', { upsertData, upsertError })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        // Find user by stripe_subscription_id
        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (!existingSub) {
          console.error('No subscription found for:', subscription.id)
          break
        }

        // Get the new plan based on price ID
        const priceId = subscription.items.data[0]?.price.id
        const { data: plan } = await supabase
          .from('subscription_plans')
          .select('id')
          .eq('stripe_price_id', priceId)
          .single()

        // Update subscription
        await supabase
          .from('subscriptions')
          .update({
            plan_id: plan?.id,
            status: subscription.status === 'active' ? 'active' : subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Get free plan
        const { data: freePlan } = await supabase
          .from('subscription_plans')
          .select('id')
          .eq('name', 'free')
          .single()

        // Downgrade to free plan
        await supabase
          .from('subscriptions')
          .update({
            plan_id: freePlan?.id,
            status: 'canceled',
            stripe_subscription_id: null,
            cancel_at_period_end: false,
          })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.subscription) {
          await supabase
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', invoice.subscription as string)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
