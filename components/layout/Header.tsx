'use client'

import Link from 'next/link'
import { Scale } from 'lucide-react'
import { UserMenu } from '@/components/auth/UserMenu'
import { useAuthContext } from '@/components/auth/AuthProvider'

export function Header() {
  const { user, loading } = useAuthContext()

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-xl border-b border-border/40">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <Scale className="w-5 h-5 text-accent transition-transform group-hover:scale-110" />
          <span className="font-serif text-lg font-medium text-foreground tracking-tight">
            <span className="text-accent">AI</span>-Odvetnik
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/blog"
            className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors px-4 py-2 rounded-lg hover:bg-card/50"
          >
            Nasveti
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors px-4 py-2 rounded-lg hover:bg-card/50"
          >
            Cenik
          </Link>
          {!loading && (
            user ? (
              <UserMenu />
            ) : (
              <Link
                href="/auth/login"
                className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors px-4 py-2 rounded-lg hover:bg-card/50"
              >
                Prijava
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  )
}
