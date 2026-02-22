'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signInWithEmail } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signInWithEmail(email, password)
      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prijava ni uspela')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          E-pošta
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ime@primer.si"
          required
          className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Geslo
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Vaše geslo"
          required
          className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Prijava
      </button>
    </form>
  )
}
