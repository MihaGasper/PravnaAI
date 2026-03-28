'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { MessageSquare, Shield, Clock } from 'lucide-react'
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
      } catch {
        // Error fetching plans
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  return (
    <div className="min-h-screen bg-background">
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

        {/* Social proof */}
        <div className="mt-16 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center p-4">
              <MessageSquare className="w-5 h-5 text-accent mb-2" />
              <p className="text-2xl font-bold text-foreground">1.000+</p>
              <p className="text-xs text-muted-foreground">pravnih vprašanj rešenih</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Clock className="w-5 h-5 text-accent mb-2" />
              <p className="text-2xl font-bold text-foreground">&lt; 30s</p>
              <p className="text-xs text-muted-foreground">povprečen čas odgovora</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Shield className="w-5 h-5 text-accent mb-2" />
              <p className="text-2xl font-bold text-foreground">24/7</p>
              <p className="text-xs text-muted-foreground">dostop brez čakanja</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-foreground leading-relaxed mb-3">
                &ldquo;V 5 minutah sem razumel svoje pravice pri odpovedi. Odvetnik bi mi za isto povedal po eni uri in za 100 EUR.&rdquo;
              </p>
              <p className="text-xs text-muted-foreground">— uporabnik, delovno pravo</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-foreground leading-relaxed mb-3">
                &ldquo;Pogodbo sem pregledal z AI-Odvetnikom preden sem šel k notarju. Opozoril me je na klavzulo, ki bi me stala tisoče.&rdquo;
              </p>
              <p className="text-xs text-muted-foreground">— uporabnik, nepremičnine</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Vprašanja? Pišite nam na{' '}
            <a
              href="mailto:podpora@ai-odvetnik.si"
              className="text-accent hover:underline"
            >
              podpora@ai-odvetnik.si
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
