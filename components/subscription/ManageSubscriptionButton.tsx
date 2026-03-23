'use client'

import { useState } from 'react'
import { Settings } from 'lucide-react'

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Napaka pri odpiranju portala')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline disabled:opacity-50"
    >
      <Settings className="w-3.5 h-3.5" />
      {loading ? 'Odpiranje...' : 'Upravljaj naročnino'}
    </button>
  )
}
