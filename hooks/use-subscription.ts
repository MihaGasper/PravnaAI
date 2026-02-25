'use client'

import { useState, useEffect, useCallback } from 'react'

interface SubscriptionPlan {
  id: string
  name: string
  display_name: string
  stripe_price_id: string | null
  queries_per_day: number
  price_cents: number
  features: string[]
}

interface UsageStatus {
  used: number
  remaining: number
  limit: number
  canQuery: boolean
}

interface SubscriptionStatus {
  subscription: {
    id: string
    status: string
    cancel_at_period_end: boolean
    current_period_end: string | null
  } | null
  plan: SubscriptionPlan
  usage: UsageStatus
}

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/subscription/status')

      if (!response.ok) {
        throw new Error('Napaka pri pridobivanju statusa')
      }

      const data = await response.json()
      setStatus(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Napaka')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  const createCheckout = async (priceId: string) => {
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      if (!response.ok) {
        throw new Error('Napaka pri ustvarjanju seje')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Napaka')
    }
  }

  const openPortal = async () => {
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Napaka pri odpiranju portala')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Napaka')
    }
  }

  return {
    status,
    loading,
    error,
    refetch: fetchStatus,
    createCheckout,
    openPortal,
  }
}
