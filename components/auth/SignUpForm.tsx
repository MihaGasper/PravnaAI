'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Loader2, CheckCircle } from 'lucide-react'

export function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUpWithEmail } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Gesli se ne ujemata')
      return
    }

    if (password.length < 6) {
      setError('Geslo mora imeti vsaj 6 znakov')
      return
    }

    setLoading(true)

    try {
      await signUpWithEmail(email, password)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registracija ni uspela')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <CheckCircle className="w-12 h-12 text-accent" />
        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground mb-2">
            Preverite svoj e-poštni predal
          </h3>
          <p className="text-sm text-muted-foreground">
            Poslali smo vam potrditveno povezavo na {email}
          </p>
        </div>
      </div>
    )
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
          placeholder="Najmanj 6 znakov"
          required
          className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
          Potrdi geslo
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Ponovno vnesite geslo"
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
        Ustvari račun
      </button>
    </form>
  )
}
