'use client'

import { Box, Flex, VStack, HStack, Text, Icon, Link as ChakraLink } from '@chakra-ui/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FiHome, FiFileText, FiUser, FiSettings } from 'react-icons/fi'

const menuItems = [
  { name: 'Overview', icon: FiHome, path: '/dashboard' },
  { name: 'Applications', icon: FiFileText, path: '/dashboard/applications' },
  { name: 'Profile', icon: FiUser, path: '/dashboard/profile' },
  { name: 'Settings', icon: FiSettings, path: '/dashboard/settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <Flex h="100vh">
      {/* Sidebar */}
      <Box
        w="250px"
        bg="gray.50"
        borderRight="1px"
        borderColor="gray.200"
        py={6}
      >
        <VStack spacing={6} align="stretch">
          <Box px={6}>
            <Text fontSize="xl" fontWeight="bold" color="primary">
              WelfareChain
            </Text>
          </Box>
          <VStack spacing={2} align="stretch">
            {menuItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <ChakraLink
                  key={item.path}
                  as={Link}
                  href={item.path}
                  _hover={{ textDecoration: 'none' }}
                  bg={isActive ? 'blue.50' : 'transparent'}
                  color={isActive ? 'blue.600' : 'gray.600'}
                >
                  <HStack
                    py={3}
                    px={6}
                    spacing={3}
                    _hover={{ bg: 'gray.100' }}
                  >
                    <Icon as={item.icon} />
                    <Text>{item.name}</Text>
                  </HStack>
                </ChakraLink>
              )
            })}
          </VStack>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex="1" overflow="auto">
        <Box p={8}>{children}</Box>
      </Box>
    </Flex>
  )
} 