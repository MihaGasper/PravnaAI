import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Stripe Price IDs - set these after creating products in Stripe Dashboard
export const STRIPE_PRICES = {
  basic: process.env.STRIPE_PRICE_BASIC || '',
  professional: process.env.STRIPE_PRICE_PROFESSIONAL || '',
} as const

// Helper to get price ID by plan name
export function getStripePriceId(planName: string): string | null {
  switch (planName) {
    case 'basic':
      return STRIPE_PRICES.basic || null
    case 'professional':
      return STRIPE_PRICES.professional || null
    default:
      return null
  }
}
