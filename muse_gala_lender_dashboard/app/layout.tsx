import AuthProvider from '@/components/Providers/AuthProvider'
import QueryProvider from '@/components/Providers/query-provider'
import { EdgeStoreProvider } from '@/lib/edgestore'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Raleway } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import type React from 'react'
import { Toaster } from 'sonner'
import './globals.css'

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-raleway',
})

export const metadata: Metadata = {
  title: 'Dress Rental Dashboard',
  description: 'A dashboard for managing dress rentals',
  generator: 'v0.dev',
  icons: {
    icon: '/Logo.svg',
    shortcut: '/Logo.svg',
    apple: '/Logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      suppressHydrationWarning={true}
      lang="en"
      className={cn(raleway.className, 'font-light')}
    >
      <body suppressHydrationWarning className="bg-[#f7f2ee]">
        <Toaster position="top-right" richColors closeButton />
        <AuthProvider>
          <QueryProvider>
            <EdgeStoreProvider>{children}</EdgeStoreProvider>
          </QueryProvider>
        </AuthProvider>

        <NextTopLoader showSpinner={false} color="#ed6b85" />
      </body>
    </html>
  )
}
