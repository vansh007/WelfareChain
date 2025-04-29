import { Box, Heading, VStack, HStack, FormControl, FormLabel, Input, Button, Text, Divider } from '@chakra-ui/react'
import DashboardLayout from '@/components/layout/DashboardLayout'

// Mock user data
const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 9876543210',
  address: '123 Main Street, City, State - 123456',
  aadharNumber: '1234-5678-9012',
  panNumber: 'ABCDE1234F',
}

export default function Profile() {
  return (
    <DashboardLayout>
      <Box>
        <Heading as="h1" size="xl" mb={6}>
          My Profile
        </Heading>

        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading as="h2" size="md" mb={4}>
                Personal Information
              </Heading>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Full Name</FormLabel>
                  <Input value={userData.name} />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input value={userData.email} />
                </FormControl>
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input value={userData.phone} />
                </FormControl>
                <FormControl>
                  <FormLabel>Address</FormLabel>
                  <Input value={userData.address} />
                </FormControl>
              </VStack>
            </Box>

            <Divider />

            <Box>
              <Heading as="h2" size="md" mb={4}>
                Identity Documents
              </Heading>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Aadhar Number</FormLabel>
                  <Input value={userData.aadharNumber} />
                </FormControl>
                <FormControl>
                  <FormLabel>PAN Number</FormLabel>
                  <Input value={userData.panNumber} />
                </FormControl>
              </VStack>
            </Box>

            <HStack justify="flex-end" spacing={4}>
              <Button variant="outline">Cancel</Button>
              <Button colorScheme="blue">Save Changes</Button>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </DashboardLayout>
  )
} 