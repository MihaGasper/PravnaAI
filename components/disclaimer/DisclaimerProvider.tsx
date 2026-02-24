'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { DisclaimerModal } from './DisclaimerModal'

const STORAGE_KEY = 'pravnaai-disclaimer-accepted'

interface DisclaimerContextType {
  hasAccepted: boolean
  acceptDisclaimer: () => void
}

const DisclaimerContext = createContext<DisclaimerContextType>({
  hasAccepted: false,
  acceptDisclaimer: () => {},
})

export function useDisclaimer() {
  return useContext(DisclaimerContext)
}

interface DisclaimerProviderProps {
  children: ReactNode
}

export function DisclaimerProvider({ children }: DisclaimerProviderProps) {
  const [hasAccepted, setHasAccepted] = useState(true) // Default true to prevent flash
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setHasAccepted(!!stored)
    setIsHydrated(true)
  }, [])

  const acceptDisclaimer = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString())
    setHasAccepted(true)
  }

  const showModal = isHydrated && !hasAccepted

  return (
    <DisclaimerContext.Provider value={{ hasAccepted, acceptDisclaimer }}>
      {children}
      <DisclaimerModal open={showModal} onAccept={acceptDisclaimer} />
    </DisclaimerContext.Provider>
  )
}
