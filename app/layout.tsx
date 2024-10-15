import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata, Viewport } from "next";
import { AuthProvider } from './AuthProvider'
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Skinvincible',
  description: 'Your personal AI-powered skin care assistant',
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors position='top-center' theme='light' />
        <Analytics />
      </body>
    </html>
  )
}
