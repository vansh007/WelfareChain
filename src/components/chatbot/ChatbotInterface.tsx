'use client'

import { useState, useRef, useEffect } from 'react'
import { FiSend, FiUser, FiMessageSquare } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { generateChatResponse } from '../../utils/gemini'

const MotionDiv = motion.div

interface Message {
  role: 'user' | 'model'
  content: string
}

export default function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 shadow-md
                  ${message.role === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                  }`}
              >
                <div className="flex items-start space-x-2">
                  <div className={`flex-shrink-0 ${message.role === 'user' ? 'text-white' : 'text-primary-500'}`}>
                    {message.role === 'user' ? <FiUser className="w-5 h-5" /> : <FiMessageSquare className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            </MotionDiv>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 input"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <FiSend className="w-5 h-5" />
                <span>Send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 