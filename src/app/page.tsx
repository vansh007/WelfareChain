'use client'

import { Box, Container, Heading, Text, Button, VStack, HStack, SimpleGrid, Icon, useColorModeValue, Image, Flex, Badge } from '@chakra-ui/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiArrowRight, FiCheckCircle, FiUsers, FiFileText, FiShield } from 'react-icons/fi'

const MotionBox = motion(Box)

export default function Home() {
  const bgColor = useColorModeValue('gray.50', 'gray.800')
  const cardBg = useColorModeValue('white', 'gray.700')

  const features = [
    {
      icon: FiUsers,
      title: 'Smart Eligibility Check',
      description: 'Our AI-powered chatbot helps you discover schemes you qualify for',
    },
    {
      icon: FiFileText,
      title: 'Easy Application Process',
      description: 'Simple document upload and verification system',
    },
    {
      icon: FiShield,
      title: 'Secure & Transparent',
      description: 'Blockchain-based tracking of your application status',
    },
  ]

  const stats = [
    { label: 'Schemes Available', value: '50+' },
    { label: 'Users Helped', value: '10K+' },
    { label: 'Success Rate', value: '95%' },
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box bg={bgColor} py={20}>
        <Container maxW="container.xl">
          <Flex direction={{ base: 'column', md: 'row' }} align="center" gap={10}>
            <Box flex={1}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Heading
                  as="h1"
                  size="2xl"
                  mb={6}
                  bgGradient="linear(to-r, blue.400, purple.500)"
                  bgClip="text"
                >
                  Discover Government Welfare Schemes
                </Heading>
                <Text fontSize="xl" color="gray.600" mb={8}>
                  Find and apply for government schemes that match your needs. Our AI-powered platform makes it easy to discover your eligibility and track your applications.
                </Text>
                <HStack spacing={4}>
                  <Link href="/chatbot" passHref>
                    <Button
                      size="lg"
                      colorScheme="blue"
                      rightIcon={<FiArrowRight />}
                      _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                      transition="all 0.2s"
                    >
                      Check Eligibility
                    </Button>
                  </Link>
                  <Link href="/schemes" passHref>
                    <Button
                      size="lg"
                      variant="outline"
                      _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                      transition="all 0.2s"
                    >
                      Browse Schemes
                    </Button>
                  </Link>
                </HStack>
              </MotionBox>
            </Box>
            <Box flex={1}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/hero-image.png"
                  alt="WelfareChain Platform"
                  borderRadius="lg"
                  shadow="xl"
                />
              </MotionBox>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Box textAlign="center">
              <Heading size="xl" mb={4}>
                Why Choose WelfareChain?
              </Heading>
              <Text fontSize="lg" color="gray.600">
                We make it easy to discover and apply for government schemes
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
              {features.map((feature, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box
                    p={8}
                    bg={cardBg}
                    borderRadius="lg"
                    shadow="md"
                    _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
                    transition="all 0.3s"
                  >
                    <Icon as={feature.icon} w={10} h={10} color="blue.500" mb={4} />
                    <Heading size="md" mb={2}>
                      {feature.title}
                    </Heading>
                    <Text color="gray.600">{feature.description}</Text>
                  </Box>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box bg={bgColor} py={20}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {stats.map((stat, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Box textAlign="center">
                  <Heading size="2xl" mb={2} color="blue.500">
                    {stat.value}
                  </Heading>
                  <Text fontSize="lg" color="gray.600">
                    {stat.label}
                  </Text>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <Box
            bgGradient="linear(to-r, blue.500, purple.500)"
            p={10}
            borderRadius="lg"
            color="white"
            textAlign="center"
          >
            <Heading size="xl" mb={4}>
              Ready to Discover Your Benefits?
            </Heading>
            <Text fontSize="lg" mb={8}>
              Start your journey to discover and apply for government welfare schemes today.
            </Text>
            <Link href="/chatbot" passHref>
              <Button
                size="lg"
                bg="white"
                color="blue.500"
                _hover={{ bg: 'gray.100' }}
                rightIcon={<FiArrowRight />}
              >
                Get Started Now
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  )
} 