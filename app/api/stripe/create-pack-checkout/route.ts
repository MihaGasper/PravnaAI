import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import { getSiteUrl } from '@/lib/utils/url'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Morate biti prijavljeni' },
        { status: 401 }
      )
    }

    // Get or create Stripe customer
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let customerId = (existingSub as any)?.stripe_customer_id as string | undefined

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      })
      customerId = customer.id
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: 999,
            product_data: {
              name: 'Dnevna vstopnica — 5 poizvedb',
              description: '5 pravnih poizvedb v 24 urah',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${getSiteUrl()}/dashboard?pack=success`,
      cancel_url: `${getSiteUrl()}/pricing?checkout=canceled`,
      metadata: {
        user_id: user.id,
        type: 'query_pack',
        queries: '5',
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
