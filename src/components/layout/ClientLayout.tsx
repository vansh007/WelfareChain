'use client'

import { Box } from '@chakra-ui/react'
import Header from './Header'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Box pt="16">
        {children}
      </Box>
    </>
  )
} 