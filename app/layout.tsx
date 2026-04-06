import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Eyeing Genius Guru - Professional Crypto & Fiat Trading Platform',
  description: 'Real-time trading charts for crypto and fiat currencies. Optimized for low-end PCs with advanced Pro Mode features.',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport = {
  themeColor: '#000000',
  userScalable: false,
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
