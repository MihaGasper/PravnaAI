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
  title: 'PravnaAI - Vas osebni pravni svetovalec',
  description: 'Pravni svetovalec za slovensko pravo z umetno inteligenco. Enostavno in strokovno.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sl" className={`${_playfair.variable} ${_dmSans.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <Header />
          <DisclaimerProvider>
            <DisclaimerBanner />
            {children}
          </DisclaimerProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
