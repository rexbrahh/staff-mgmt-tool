import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { StoreProvider } from '../providers/StoreProvider'
import { ThemeProvider } from '../providers/ThemeProvider'

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
            {children}
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  )
}