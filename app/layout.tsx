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
    <html lang="en" suppressHydrationWarning data-theme="light">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const stored = localStorage.getItem('theme-mode');
              const theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              document.documentElement.setAttribute('data-theme', theme);
              
              const themes = {
                light: {background:'#ffffff',surface:'#f8f9fa','surface-alt':'#e9ecef',border:'#dee2e6',text:'#212529','text-secondary':'#495057','text-tertiary':'#6c757d',primary:'#1a73e8',accent:'#fbbf24',success:'#10b981',danger:'#ef4444',warning:'#f59e0b'},
                dark: {background:'#0f0f0f',surface:'#1a1a1a','surface-alt':'#2d2d2d',border:'#3f3f3f',text:'#e0e0e0','text-secondary':'#b0b0b0','text-tertiary':'#808080',primary:'#60a5fa',accent:'#fbbf24',success:'#34d399',danger:'#f87171',warning:'#fbbf24'},
                pro: {background:'#0a0e27',surface:'#111829','surface-alt':'#1f2937',border:'#374151',text:'#f3f4f6','text-secondary':'#d1d5db','text-tertiary':'#9ca3af',primary:'#3b82f6',accent:'#ec4899',success:'#10b981',danger:'#ef4444',warning:'#f59e0b'}
              };
              
              Object.entries(themes[theme]).forEach(([key, value]) => {
                document.documentElement.style.setProperty('--color-' + key, value);
              });
            })();
          `
        }} />
      </head>
      <body className="bg-[var(--color-background)] text-[var(--color-text)] w-full h-full m-0 p-0">
        <div id="root" className="w-full h-full">
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}
