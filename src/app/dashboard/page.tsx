'use client'

import { Box, Grid, Heading, Text, Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from '@chakra-ui/react'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Box>
        <Heading as="h1" size="xl" mb={6}>
          Dashboard Overview
        </Heading>

        <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={8}>
          <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
            <Stat>
              <StatLabel>Active Applications</StatLabel>
              <StatNumber>3</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23.36%
              </StatHelpText>
            </Stat>
          </Box>

          <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
            <Stat>
              <StatLabel>Eligible Schemes</StatLabel>
              <StatNumber>5</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                2 new schemes
              </StatHelpText>
            </Stat>
          </Box>

          <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
            <Stat>
              <StatLabel>Benefits Received</StatLabel>
              <StatNumber>₹15,000</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                Last 30 days
              </StatHelpText>
            </Stat>
          </Box>
        </Grid>

        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
          <Heading as="h2" size="md" mb={4}>
            Recent Activity
          </Heading>
          <Box>
            <Text color="gray.600">No recent activity to display</Text>
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  )
} 