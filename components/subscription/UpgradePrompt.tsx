'use client'

import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Link from 'next/link'

interface UpgradePromptProps {
  open: boolean
  onClose: () => void
}

export function UpgradePrompt({ open, onClose }: UpgradePromptProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-accent" />
            </div>
          </div>
          <AlertDialogTitle className="text-center">
            Dosegli ste dnevno omejitev
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Z brezplačnim paketom imate na voljo 1 poizvedbo na dan.
            Nadgradite svoj paket za več poizvedb in dodatne funkcionalnosti.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <Button asChild className="w-full">
            <Link href="/pricing">
              Poglej pakete
            </Link>
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            Poskusim jutri
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
