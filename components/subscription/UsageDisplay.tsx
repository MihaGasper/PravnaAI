'use client'

import { useSubscription } from '@/hooks/use-subscription'
import { cn } from '@/lib/utils'

interface UsageDisplayProps {
  className?: string
  compact?: boolean
}

export function UsageDisplay({ className, compact = false }: UsageDisplayProps) {
  const { status, loading } = useSubscription()

  if (loading || !status) {
    return (
      <div className={cn('animate-pulse bg-muted rounded h-6 w-24', className)} />
    )
  }

  const { usage, plan } = status
  const percentage = Math.round((usage.used / usage.limit) * 100)
  const isLow = usage.remaining <= 1 && usage.remaining > 0
  const isExhausted = usage.remaining === 0

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2 text-sm', className)}>
        <span className={cn(
          'font-medium',
          isExhausted && 'text-destructive',
          isLow && 'text-amber-600'
        )}>
          {usage.remaining}/{usage.limit}
        </span>
        <span className="text-muted-foreground">poizvedb</span>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Dnevne poizvedbe</span>
        <span className={cn(
          'font-medium',
          isExhausted && 'text-destructive',
          isLow && 'text-amber-600'
        )}>
          {usage.used} / {usage.limit}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300',
            isExhausted ? 'bg-destructive' :
            isLow ? 'bg-amber-500' :
            'bg-accent'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Paket: {plan.display_name}</span>
        <span>
          {isExhausted
            ? 'Nadgradite za več poizvedb'
            : `Še ${usage.remaining} na voljo`}
        </span>
      </div>
    </div>
  )
}
