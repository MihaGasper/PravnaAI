'use client'

import { Scale } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

interface DisclaimerModalProps {
  open: boolean
  onAccept: () => void
}

export function DisclaimerModal({ open, onAccept }: DisclaimerModalProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Scale className="w-6 h-6 text-accent" />
            </div>
          </div>
          <AlertDialogTitle className="text-center">
            Pomembno obvestilo
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-left space-y-3 text-sm text-muted-foreground">
              <p>
                Ta aplikacija zagotavlja splošne pravne informacije in ne predstavlja
                pravnega svetovanja v smislu Zakona o odvetništvu (ZOdv).
              </p>
              <p>Informacije, ki jih ponuja PravnaAI:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>so namenjene zgolj kot izhodišče za razumevanje pravnih vprašanj</li>
                <li>ne upoštevajo vseh posebnosti vaše konkretne situacije</li>
                <li>ne nadomeščajo strokovnega pravnega mnenja</li>
                <li>se lahko razlikujejo od trenutne sodne prakse</li>
              </ul>
              <p>
                Za obravnavo vašega konkretnega primera se obrnite na odvetnika ali
                drugega pooblaščenega pravnega strokovnjaka.
              </p>
              <p className="font-medium text-foreground">
                Z uporabo te aplikacije potrjujete, da razumete in sprejemate te pogoje.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onAccept} className="w-full">
            Razumem
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
