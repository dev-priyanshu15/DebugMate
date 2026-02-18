import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'DebugMate — Not Just The Fix. The Understanding.',
    template: '%s | DebugMate',
  },
  description:
    'AI-powered debugging assistant that teaches you WHY your code broke. Get structured debug reports, step-by-step fixes, and track your weak spots over time.',
  keywords: ['debugging', 'AI', 'developer tools', 'code fix', 'bug fix', 'programming'],
  authors: [{ name: 'DebugMate' }],
  creator: 'DebugMate',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'DebugMate — Not Just The Fix. The Understanding.',
    description: 'AI debugging that teaches you WHY your code broke.',
    siteName: 'DebugMate',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DebugMate — Not Just The Fix. The Understanding.',
    description: 'AI debugging that teaches you WHY your code broke.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body>
          <ThemeProvider>
            <QueryProvider>
              {children}
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

