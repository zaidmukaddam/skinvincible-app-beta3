import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from './AuthProvider'
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Skinvincible',
  description: 'Your personal AI-powered skin care assistant',
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
      </body>
    </html>
  )
}
