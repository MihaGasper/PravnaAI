import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import { getSiteUrl } from '@/lib/utils/url'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Morate biti prijavljeni' },
        { status: 401 }
      )
    }

    const { priceId } = await request.json()

    if (!priceId) {
      return NextResponse.json(
        { error: 'Manjka priceId' },
        { status: 400 }
      )
    }

    // Check if user already has a subscription
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id, status, plan:subscription_plans(stripe_price_id)')
      .eq('user_id', user.id)
      .single()

    // Block purchase if user already has an active subscription with the same plan
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingPriceId = (existingSub?.plan as any)?.stripe_price_id
    if (existingSub?.status === 'active' && existingPriceId === priceId) {
      return NextResponse.json(
        { error: 'Že imate aktiven paket. Za spremembo uporabite upravljanje naročnine.' },
        { status: 400 }
      )
    }

    let customerId = existingSub?.stripe_customer_id

    // Create a new customer if needed
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      })
      customerId = customer.id
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${getSiteUrl()}/dashboard?checkout=success`,
      cancel_url: `${getSiteUrl()}/pricing?checkout=canceled`,
      metadata: {
        user_id: user.id,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
        },
      },
      locale: 'sl',
    })

    return NextResponse.json({ url: session.url })
  } catch {
    return NextResponse.json(
      { error: 'Napaka pri ustvarjanju seje za plačilo' },
      { status: 500 }
    )
  }
}
