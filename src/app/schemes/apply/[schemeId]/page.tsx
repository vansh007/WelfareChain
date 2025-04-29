'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Progress,
  HStack,
  Icon,
  Textarea,
  Divider,
} from '@chakra-ui/react'
import { FiUpload, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'

interface Document {
  id: string
  name: string
  required: boolean
  status: 'pending' | 'uploaded' | 'verified'
  file?: File
}

export default function SchemeApplicationPage({
  params,
}: {
  params: { schemeId: string }
}) {
  const [step, setStep] = useState(1)
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'Aadhar Card', required: true, status: 'pending' },
    { id: '2', name: 'PAN Card', required: true, status: 'pending' },
    { id: '3', name: 'Income Certificate', required: true, status: 'pending' },
    { id: '4', name: 'Bank Statement', required: false, status: 'pending' },
  ])
  const toast = useToast()

  const handleFileUpload = (documentId: string, file: File) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? { ...doc, file, status: 'uploaded' }
          : doc
      )
    )
  }

  const handleSubmit = () => {
    // TODO: Implement actual submission logic
    toast({
      title: 'Application Submitted',
      description: 'Your application has been submitted successfully.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Apply for Scheme
          </Heading>
          <Text fontSize="xl" color="gray.600">
            Complete your application by providing the required information and documents
          </Text>
        </Box>

        <Progress value={(step / 3) * 100} colorScheme="blue" mb={8} />

        {step === 1 && (
          <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
            <VStack spacing={6} align="stretch">
              <Heading size="md">Personal Information</Heading>
              <FormControl>
                <FormLabel>Full Name</FormLabel>
                <Input placeholder="Enter your full name" />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="Enter your email" />
              </FormControl>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input type="tel" placeholder="Enter your phone number" />
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Textarea placeholder="Enter your complete address" />
              </FormControl>
              <Button colorScheme="blue" onClick={() => setStep(2)}>
                Next
              </Button>
            </VStack>
          </Box>
        )}

        {step === 2 && (
          <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
            <VStack spacing={6} align="stretch">
              <Heading size="md">Upload Documents</Heading>
              {documents.map((doc) => (
                <Box key={doc.id} p={4} borderWidth={1} borderRadius="md">
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium">{doc.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {doc.required ? 'Required' : 'Optional'}
                      </Text>
                    </VStack>
                    <HStack>
                      {doc.status === 'uploaded' && (
                        <Icon as={FiCheckCircle} color="green.500" />
                      )}
                      {doc.status === 'pending' && (
                        <Icon as={FiAlertCircle} color="yellow.500" />
                      )}
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(doc.id, file)
                        }}
                        display="none"
                        id={`file-${doc.id}`}
                      />
                      <Button
                        as="label"
                        htmlFor={`file-${doc.id}`}
                        leftIcon={<FiUpload />}
                        variant="outline"
                      >
                        Upload
                      </Button>
                    </HStack>
                  </HStack>
                </Box>
              ))}
              <HStack justify="space-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => setStep(3)}
                  isDisabled={!documents.every((doc) => doc.status === 'uploaded')}
                >
                  Next
                </Button>
              </HStack>
            </VStack>
          </Box>
        )}

        {step === 3 && (
          <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
            <VStack spacing={6} align="stretch">
              <Heading size="md">Review and Submit</Heading>
              <Text>
                Please review your application before submitting. Make sure all
                information is correct and all required documents are uploaded.
              </Text>
              <Divider />
              <HStack justify="space-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button colorScheme="blue" onClick={handleSubmit}>
                  Submit Application
                </Button>
              </HStack>
            </VStack>
          </Box>
        )}
      </VStack>
    </Container>
  )
} 