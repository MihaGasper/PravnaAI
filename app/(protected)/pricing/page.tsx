'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PricingTable } from '@/components/subscription/PricingTable'
import { UsageDisplay } from '@/components/subscription/UsageDisplay'

interface Plan {
  id: string
  name: string
  display_name: string
  stripe_price_id: string | null
  queries_per_day: number
  price_cents: number
  features: string[]
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const checkoutCanceled = searchParams.get('checkout') === 'canceled'

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch('/api/subscription/plans')
        if (response.ok) {
          const data = await response.json()
          setPlans(data.plans)
        }
      } catch (error) {
        console.error('Error fetching plans:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Nazaj na nadzorno ploščo
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold font-serif mb-4">
            Izberite svoj paket
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pridobite več poizvedb na dan in dodatne funkcionalnosti
            z nadgradnjo vašega paketa.
          </p>
        </div>

        {/* Checkout canceled message */}
        {checkoutCanceled && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-center text-sm text-amber-800">
            Plačilo je bilo preklicano. Če imate težave, nas kontaktirajte.
          </div>
        )}

        {/* Current usage */}
        <div className="mb-12 max-w-md mx-auto">
          <UsageDisplay />
        </div>

        {/* Pricing table */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 bg-muted animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : (
          <PricingTable plans={plans} />
        )}

        {/* FAQ or additional info */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Vprašanja? Pišite nam na{' '}
            <a
              href="mailto:podpora@pravna.ai"
              className="text-accent hover:underline"
            >
              podpora@pravna.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
