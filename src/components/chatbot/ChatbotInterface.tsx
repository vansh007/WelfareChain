'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Flex,
  Avatar,
  useToast,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiSend, FiUser, FiMessageSquare } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { generateChatResponse } from '../../utils/gemini'

const MotionBox = motion.create(Box)

interface Message {
  role: 'user' | 'model'
  content: string
}

export default function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await generateChatResponse([...messages, userMessage])
      const modelMessage: Message = { role: 'model', content: response }
      setMessages((prev) => [...prev, modelMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        role: 'model',
        content: 'Sorry, I encountered an error. Please try again.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const onKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Box
      h="100vh"
      display="flex"
      flexDirection="column"
      bg={useColorModeValue('gray.50', 'gray.900')}
    >
      <VStack
        flex={1}
        overflowY="auto"
        p={4}
        spacing={4}
        alignItems="stretch"
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
              maxW="70%"
            >
              <Box
                bg={message.role === 'user' ? 'brand.500' : bgColor}
                color={message.role === 'user' ? 'white' : 'inherit'}
                p={3}
                borderRadius="lg"
                boxShadow="md"
                borderWidth={1}
                borderColor={borderColor}
              >
                <Text>{message.content}</Text>
              </Box>
            </MotionBox>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </VStack>

      <Box
        p={4}
        borderTop="1px"
        borderColor={borderColor}
        bg={bgColor}
      >
        <HStack>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            colorScheme="brand"
            isLoading={isLoading}
            loadingText="Sending..."
          >
            Send
          </Button>
        </HStack>
      </Box>
    </Box>
  )
} 