'use client'

import { useState } from 'react'
import { Check, Zap } from 'lucide-react'
import { PricingCard } from './PricingCard'
import { Button } from '@/components/ui/button'
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
  const [packLoading, setPackLoading] = useState(false)

  const handleSelect = async (priceId: string) => {
    setCheckoutLoading(priceId)
    try {
      await createCheckout(priceId)
    } finally {
      setCheckoutLoading(null)
    }
  }

  const handleBuyPack = async () => {
    setPackLoading(true)
    try {
      const response = await fetch('/api/stripe/create-pack-checkout', {
        method: 'POST',
      })
      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      }
    } finally {
      setPackLoading(false)
    }
  }

  const currentPlanName = status?.plan?.name || 'free'

  return (
    <div className="flex flex-col gap-8">
      {/* Day pass */}
      <div className="mx-auto w-full max-w-md rounded-2xl border border-accent/30 bg-accent/5 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold">Dnevna vstopnica</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Enkratno plačilo — brez naročnine
        </p>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-bold">9,99 €</span>
          <span className="text-muted-foreground text-sm">/ enkratno</span>
        </div>
        <ul className="space-y-2 mb-5">
          <li className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-accent shrink-0" />
            5 poizvedb v 24 urah
          </li>
          <li className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-accent shrink-0" />
            + 1 brezplačna poizvedba na dan
          </li>
          <li className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-accent shrink-0" />
            Celoten odgovor brez omejitev
          </li>
          <li className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-accent shrink-0" />
            Brez obveznosti — brez naročnine
          </li>
        </ul>
        <Button
          onClick={handleBuyPack}
          disabled={packLoading}
          className="w-full"
        >
          {packLoading ? 'Nalaganje...' : 'Kupi dnevno vstopnico'}
        </Button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 border-t border-border" />
        <span className="text-xs text-muted-foreground">ali izberite mesečni paket</span>
        <div className="flex-1 border-t border-border" />
      </div>

      {/* Subscription plans */}
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
    </div>
  )
}
