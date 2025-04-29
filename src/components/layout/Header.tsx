'use client'

import {
  Box,
  Flex,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiUser, FiSettings, FiLogOut, FiHome } from 'react-icons/fi'

export default function Header() {
  const pathname = usePathname()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const isActive = (path: string) => pathname === path

  return (
    <Box
      as="header"
      position="fixed"
      w="full"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      zIndex="sticky"
    >
      <Flex
        h="16"
        alignItems="center"
        justifyContent="space-between"
        maxW="container.xl"
        mx="auto"
        px={4}
      >
        <HStack spacing={8}>
          <Link href="/" passHref>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="primary"
              _hover={{ textDecoration: 'none' }}
            >
              WelfareChain
            </Text>
          </Link>

          <HStack spacing={4}>
            <Link href="/" passHref>
              <Button
                variant="ghost"
                leftIcon={<Icon as={FiHome} />}
                colorScheme={isActive('/') ? 'blue' : 'gray'}
              >
                Home
              </Button>
            </Link>
            <Link href="/schemes" passHref>
              <Button
                variant="ghost"
                colorScheme={isActive('/schemes') ? 'blue' : 'gray'}
              >
                Schemes
              </Button>
            </Link>
            <Link href="/chatbot" passHref>
              <Button
                variant="ghost"
                colorScheme={isActive('/chatbot') ? 'blue' : 'gray'}
              >
                Check Eligibility
              </Button>
            </Link>
            <Link href="/dashboard" passHref>
              <Button
                variant="ghost"
                colorScheme={isActive('/dashboard') ? 'blue' : 'gray'}
              >
                Dashboard
              </Button>
            </Link>
          </HStack>
        </HStack>

        <Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            leftIcon={<Icon as={FiUser} />}
          >
            John Doe
          </MenuButton>
          <MenuList>
            <Link href="/dashboard/profile" passHref>
              <MenuItem icon={<Icon as={FiUser} />}>Profile</MenuItem>
            </Link>
            <Link href="/dashboard/settings" passHref>
              <MenuItem icon={<Icon as={FiSettings} />}>Settings</MenuItem>
            </Link>
            <MenuItem icon={<Icon as={FiLogOut} />}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  )
} 