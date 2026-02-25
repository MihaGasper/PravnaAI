'use client'

import { useState, useEffect } from 'react'
import { PricingCard } from './PricingCard'
import { useSubscription } from '@/hooks/use-subscription'

interface Plan {
  id: string
  name: string
  display_name: string
  stripe_price_id: string | null
  queries_per_day: number
  price_cents: number
  features: string[]
}

interface PricingTableProps {
  plans: Plan[]
}

export function PricingTable({ plans }: PricingTableProps) {
  const { status, createCheckout, loading: subscriptionLoading } = useSubscription()
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  const handleSelect = async (priceId: string) => {
    setCheckoutLoading(priceId)
    try {
      await createCheckout(priceId)
    } finally {
      setCheckoutLoading(null)
    }
  }

  const currentPlanName = status?.plan?.name || 'free'

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <PricingCard
          key={plan.id}
          name={plan.name}
          displayName={plan.display_name}
          priceCents={plan.price_cents}
          queriesPerDay={plan.queries_per_day}
          features={plan.features}
          stripePriceId={plan.stripe_price_id}
          isCurrentPlan={plan.name === currentPlanName}
          onSelect={handleSelect}
          loading={checkoutLoading === plan.stripe_price_id || subscriptionLoading}
        />
      ))}
    </div>
  )
}
