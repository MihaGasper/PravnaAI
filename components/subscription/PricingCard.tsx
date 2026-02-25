'use client'

import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PricingCardProps {
  name: string
  displayName: string
  priceCents: number
  queriesPerDay: number
  features: string[]
  stripePriceId: string | null
  isCurrentPlan?: boolean
  onSelect: (priceId: string) => void
  loading?: boolean
}

export function PricingCard({
  name,
  displayName,
  priceCents,
  queriesPerDay,
  features,
  stripePriceId,
  isCurrentPlan = false,
  onSelect,
  loading = false,
}: PricingCardProps) {
  const isFree = priceCents === 0
  const priceEuros = (priceCents / 100).toFixed(2).replace('.', ',')
  const isPopular = name === 'basic'

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md',
        isPopular && 'border-accent ring-2 ring-accent/20',
        isCurrentPlan && 'border-accent'
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full">
            Najbolj priljubljen
          </span>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <span className="bg-accent/20 text-accent text-xs font-medium px-3 py-1 rounded-full">
            Vaš paket
          </span>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-semibold">{displayName}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold">
            {isFree ? 'Brezplačno' : `${priceEuros} €`}
          </span>
          {!isFree && (
            <span className="text-muted-foreground text-sm">/mesec</span>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {queriesPerDay} {queriesPerDay === 1 ? 'poizvedba' : queriesPerDay < 5 ? 'poizvedbe' : 'poizvedb'} na dan
        </p>
      </div>

      <ul className="mb-6 flex-1 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => stripePriceId && onSelect(stripePriceId)}
        disabled={isCurrentPlan || isFree || loading || !stripePriceId}
        variant={isPopular ? 'default' : 'outline'}
        className="w-full"
      >
        {isCurrentPlan
          ? 'Trenutni paket'
          : isFree
            ? 'Brezplačno'
            : loading
              ? 'Nalaganje...'
              : !stripePriceId
                ? 'Kmalu na voljo'
                : 'Izberi paket'}
      </Button>
    </div>
  )
}
