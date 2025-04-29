import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import ClientLayout from '@/components/layout/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WelfareChain - Government Scheme Discovery',
  description: 'Discover and apply for government welfare schemes using blockchain technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChakraProvider>
          <ClientLayout>{children}</ClientLayout>
        </ChakraProvider>
      </body>
    </html>
  )
} 