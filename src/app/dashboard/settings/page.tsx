'use client'

import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Switch,
  Button,
  Divider,
  HStack,
  useToast,
  Select,
  Input,
} from '@chakra-ui/react'
import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
    language: 'en',
    timezone: 'Asia/Kolkata',
  })
  const toast = useToast()

  const handleSave = () => {
    // TODO: Implement actual settings save logic
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <DashboardLayout>
      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading as="h1" size="xl" mb={4}>
              Settings
            </Heading>
            <Text color="gray.600">
              Manage your account preferences and notification settings
            </Text>
          </Box>

          <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
            <VStack spacing={6} align="stretch">
              <Box>
                <Heading size="md" mb={4}>
                  Notifications
                </Heading>
                <VStack spacing={4} align="stretch">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Email Notifications</FormLabel>
                    <Switch
                      isChecked={settings.emailNotifications}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          emailNotifications: e.target.checked,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">SMS Notifications</FormLabel>
                    <Switch
                      isChecked={settings.smsNotifications}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          smsNotifications: e.target.checked,
                        })
                      }
                    />
                  </FormControl>
                </VStack>
              </Box>

              <Divider />

              <Box>
                <Heading size="md" mb={4}>
                  Appearance
                </Heading>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Dark Mode</FormLabel>
                  <Switch
                    isChecked={settings.darkMode}
                    onChange={(e) =>
                      setSettings({ ...settings, darkMode: e.target.checked })
                    }
                  />
                </FormControl>
              </Box>

              <Divider />

              <Box>
                <Heading size="md" mb={4}>
                  Preferences
                </Heading>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Language</FormLabel>
                    <Select
                      value={settings.language}
                      onChange={(e) =>
                        setSettings({ ...settings, language: e.target.value })
                      }
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="bn">Bengali</option>
                      <option value="ta">Tamil</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Timezone</FormLabel>
                    <Select
                      value={settings.timezone}
                      onChange={(e) =>
                        setSettings({ ...settings, timezone: e.target.value })
                      }
                    >
                      <option value="Asia/Kolkata">India (IST)</option>
                      <option value="Asia/Delhi">Delhi</option>
                      <option value="Asia/Mumbai">Mumbai</option>
                      <option value="Asia/Kolkata">Kolkata</option>
                    </Select>
                  </FormControl>
                </VStack>
              </Box>

              <Divider />

              <Box>
                <Heading size="md" mb={4}>
                  Security
                </Heading>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Current Password</FormLabel>
                    <Input type="password" placeholder="Enter current password" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>New Password</FormLabel>
                    <Input type="password" placeholder="Enter new password" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Confirm New Password</FormLabel>
                    <Input type="password" placeholder="Confirm new password" />
                  </FormControl>
                </VStack>
              </Box>

              <HStack justify="flex-end" spacing={4}>
                <Button variant="outline">Cancel</Button>
                <Button colorScheme="blue" onClick={handleSave}>
                  Save Changes
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </DashboardLayout>
  )
} 