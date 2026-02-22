'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from './AuthProvider'
import { useAuth } from '@/hooks/use-auth'
import { User, LogOut, History, LayoutDashboard, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export function UserMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { user, loading } = useAuthContext()
  const { signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setOpen(false)
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
    )
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="inline-flex items-center justify-center gap-1.5 min-h-[44px] rounded-lg px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
      >
        <User className="w-3.5 h-3.5" />
        <span className="sr-only sm:not-sr-only">Prijava</span>
      </Link>
    )
  }

  const userInitial = user.email?.charAt(0).toUpperCase() || 'U'
  const userAvatar = user.user_metadata?.avatar_url

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 min-h-[44px] rounded-lg px-2 text-sm transition-colors hover:bg-secondary"
        aria-label="Uporabniški meni"
      >
        {userAvatar ? (
          <img
            src={userAvatar}
            alt=""
            className="w-7 h-7 rounded-full"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-xs font-medium text-accent-foreground">
            {userInitial}
          </div>
        )}
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-lg py-1 z-50 animate-fade-up">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>

          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
              Nadzorna plošča
            </Link>
            <Link
              href="/history"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
            >
              <History className="w-4 h-4 text-muted-foreground" />
              Zgodovina
            </Link>
          </div>

          <div className="border-t border-border py-1">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
            >
              <LogOut className="w-4 h-4 text-muted-foreground" />
              Odjava
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
