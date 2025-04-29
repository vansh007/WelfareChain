import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, HStack } from '@chakra-ui/react'
import DashboardLayout from '@/components/layout/DashboardLayout'

// Mock data for applications
const applications = [
  {
    id: '1',
    schemeName: 'PM-KISAN',
    status: 'pending',
    submittedDate: '2024-02-15',
    amount: '₹6,000',
  },
  {
    id: '2',
    schemeName: 'PM Ujjwala Yojana',
    status: 'approved',
    submittedDate: '2024-02-10',
    amount: '₹1,600',
  },
  {
    id: '3',
    schemeName: 'PM Awas Yojana',
    status: 'rejected',
    submittedDate: '2024-02-05',
    amount: '₹1,20,000',
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'green'
    case 'pending':
      return 'yellow'
    case 'rejected':
      return 'red'
    default:
      return 'gray'
  }
}

export default function Applications() {
  return (
    <DashboardLayout>
      <Box>
        <HStack justify="space-between" mb={6}>
          <Heading as="h1" size="xl">
            My Applications
          </Heading>
          <Button colorScheme="blue">New Application</Button>
        </HStack>

        <Box bg="white" borderRadius="lg" boxShadow="sm" overflow="hidden">
          <Table>
            <Thead>
              <Tr>
                <Th>Scheme Name</Th>
                <Th>Status</Th>
                <Th>Submitted Date</Th>
                <Th>Amount</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {applications.map((app) => (
                <Tr key={app.id}>
                  <Td>{app.schemeName}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(app.status)}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </Td>
                  <Td>{app.submittedDate}</Td>
                  <Td>{app.amount}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      {app.status === 'pending' && (
                        <Button size="sm" colorScheme="red" variant="outline">
                          Cancel
                        </Button>
                      )}
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </DashboardLayout>
  )
} 