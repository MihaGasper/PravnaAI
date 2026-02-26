'use client'

import { Scale } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DisclaimerBannerProps {
  className?: string
}

export function DisclaimerBanner({ className }: DisclaimerBannerProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 px-4 py-2 bg-accent/10 border-b border-accent/20',
        className
      )}
    >
      <Scale className="w-3.5 h-3.5 text-accent shrink-0" />
      <p className="text-xs text-muted-foreground text-center">
        Ta aplikacija ponuja splošne pravne informacije in ne nadomešča posveta z odvetnikom.
      </p>
    </div>
  )
}
