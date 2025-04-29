'use client'

import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'
import ChatbotInterface from '@/components/chatbot/ChatbotInterface'

export default function ChatbotPage() {
  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Scheme Discovery Chatbot
          </Heading>
          <Text fontSize="xl" color="gray.600">
            Tell us about yourself to discover eligible government welfare schemes
          </Text>
        </Box>

        <ChatbotInterface />
      </VStack>
    </Container>
  )
} 