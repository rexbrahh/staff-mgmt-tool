import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { StoreProvider } from '../providers/StoreProvider'
import { ThemeProvider } from '../providers/ThemeProvider'
import { AuthInitializer } from '../components/AuthInitializer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Staff Management Tool',
  description: 'Modern staff management application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="emotion-insertion-point" content="" />
      </head>
      <body className={inter.className}>
        <StoreProvider>
          <ThemeProvider>
            <AuthInitializer />
            {children}
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  )
}