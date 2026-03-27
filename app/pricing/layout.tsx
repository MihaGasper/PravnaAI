import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cenik — paketi in naročnine',
  description: 'Izberite paket AI pravnega svetovanja: brezplačen, osnovni ali profesionalni. Pravna pomoč z umetno inteligenco že od 0 EUR.',
  keywords: [
    'AI odvetnik cena',
    'pravna pomoč cena',
    'pravni nasvet cena',
    'cenovno ugoden odvetnik',
    'brezplačna pravna pomoč',
  ],
  alternates: {
    canonical: 'https://aiodvetnik.si/pricing',
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
