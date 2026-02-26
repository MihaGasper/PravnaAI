'use client'

import Link from 'next/link'
import { Scale } from 'lucide-react'
import { UserMenu } from '@/components/auth/UserMenu'
import { useAuthContext } from '@/components/auth/AuthProvider'

export function Header() {
  const { user, loading } = useAuthContext()

  return (
    <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-lg border-b border-border/60">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Scale className="w-4 h-4 text-accent" />
          <span className="font-serif text-base font-medium text-foreground">PravnaAI</span>
        </Link>

        {!loading && (
          user ? (
            <UserMenu />
          ) : (
            <Link
              href="/auth/login"
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Prijava
            </Link>
          )
        )}
      </div>
    </header>
  )
}
