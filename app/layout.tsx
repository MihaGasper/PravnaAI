import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { DisclaimerProvider, DisclaimerBanner } from '@/components/disclaimer'
import { Header } from '@/components/layout/Header'
import './globals.css'

const _playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const _dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://aiodvetnik.si'),
  title: {
    default: 'AI-Odvetnik - Brezplačna pravna pomoč z umetno inteligenco',
    template: '%s | AI-Odvetnik',
  },
  description: 'Brezplačna pravna pomoč in pravni nasveti za slovensko pravo z umetno inteligenco. Odvetnik online 24/7 — dedovanje, ločitev, delovno pravo, nepremičnine.',
  keywords: [
    'odvetnik',
    'pravna pomoč',
    'advokat',
    'pravni nasvet',
    'brezplačna pravna pomoč',
    'odvetnik online',
    'AI odvetnik',
    'pravni svetovalec',
    'slovensko pravo',
    'pravna pomoč online',
    'pravnik',
    'pravni nasveti brezplačno',
    'pogodba',
    'pregled pogodbe',
    'menjalna pogodba',
    'kupoprodajna pogodba',
    'najemna pogodba',
    'darilna pogodba',
    'pogodba o zaposlitvi',
    'sestavitev pogodbe',
    'vzorec pogodbe',
    'kako napisati pogodbo',
    'avtorska pogodba',
    'podjemna pogodba',
    'gradbena pogodba',
    'predpogodba za nepremičnino',
    'pogodba o dosmrtnem preživljanju',
    'razveza pogodbe',
  ],
  authors: [{ name: 'AI-Odvetnik', url: 'https://aiodvetnik.si' }],
  creator: 'AI-Odvetnik',
  publisher: '2DSOFT d.o.o.',
  openGraph: {
    type: 'website',
    locale: 'sl_SI',
    url: 'https://aiodvetnik.si',
    siteName: 'AI-Odvetnik',
    title: 'AI-Odvetnik - Brezplačna pravna pomoč z umetno inteligenco',
    description: 'Brezplačna pravna pomoč in pravni nasveti za slovensko pravo z umetno inteligenco. Odvetnik online 24/7.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Odvetnik - Brezplačna pravna pomoč z umetno inteligenco',
    description: 'Brezplačna pravna pomoč in pravni nasveti za slovensko pravo z umetno inteligenco.',
  },
  alternates: {
    canonical: 'https://aiodvetnik.si',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-dark-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://aiodvetnik.si/#organization',
        name: 'AI-Odvetnik',
        url: 'https://aiodvetnik.si',
        logo: 'https://aiodvetnik.si/icon.svg',
        description: 'AI pravni svetovalec za slovensko pravo',
        founder: {
          '@type': 'Organization',
          name: '2DSOFT d.o.o.',
        },
      },
      {
        '@type': 'WebApplication',
        '@id': 'https://aiodvetnik.si/#app',
        name: 'AI-Odvetnik',
        url: 'https://aiodvetnik.si',
        applicationCategory: 'LegalService',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
          description: 'Brezplačna pravna pomoč z umetno inteligenco',
        },
        inLanguage: 'sl',
        provider: {
          '@type': 'Organization',
          name: '2DSOFT d.o.o.',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://aiodvetnik.si/#website',
        url: 'https://aiodvetnik.si',
        name: 'AI-Odvetnik',
        description: 'Brezplačna pravna pomoč in pravni nasveti za slovensko pravo z umetno inteligenco',
        inLanguage: 'sl',
        publisher: {
          '@id': 'https://aiodvetnik.si/#organization',
        },
      },
    ],
  }

  return (
    <html lang="sl" className={`${_playfair.variable} ${_dmSans.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>
          <DisclaimerProvider>
            <DisclaimerBanner />
            <Header />
            {children}
          </DisclaimerProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
