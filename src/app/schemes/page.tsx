'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  Icon,
  Flex,
  Image,
} from '@chakra-ui/react'
import { FiSearch, FiFileText, FiCheckCircle, FiArrowRight, FiFilter } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

// Mock data for ministries and schemes
const ministries = [
  {
    id: 'agriculture',
    name: 'Ministry of Agriculture',
    logo: '/ministry-logos/agriculture.png',
    schemes: [
      {
        id: 'pm-kisan',
        name: 'PM-KISAN',
        description: 'Income support of ₹6,000 per year to all farmer families',
        eligibility: ['Farmer', 'Land owner'],
        benefits: ['₹6,000 per year', 'Direct bank transfer'],
        documents: ['Aadhar Card', 'Land ownership proof', 'Bank account details'],
        icon: '/scheme-icons/pm-kisan.png',
      },
      {
        id: 'pm-fasal-bima',
        name: 'PM Fasal Bima Yojana',
        description: 'Crop insurance scheme for farmers',
        eligibility: ['Farmer', 'Crop cultivator'],
        benefits: ['Crop insurance', 'Premium subsidy'],
        documents: ['Aadhar Card', 'Land records', 'Bank account details'],
        icon: '/scheme-icons/fasal-bima.png',
      },
    ],
  },
  {
    id: 'housing',
    name: 'Ministry of Housing',
    logo: '/ministry-logos/housing.png',
    schemes: [
      {
        id: 'pm-awas',
        name: 'PM Awas Yojana',
        description: 'Housing for all by 2022',
        eligibility: ['BPL', 'EWS', 'LIG'],
        benefits: ['Housing subsidy', 'Interest subsidy'],
        documents: ['Aadhar Card', 'Income certificate', 'Bank account details'],
        icon: '/scheme-icons/pm-awas.png',
      },
    ],
  },
  {
    id: 'rural',
    name: 'Ministry of Rural Development',
    logo: '/ministry-logos/rural.png',
    schemes: [
      {
        id: 'mgnrega',
        name: 'MGNREGA',
        description: 'Guaranteed employment in rural areas',
        eligibility: ['Rural resident', 'Adult'],
        benefits: ['100 days of employment', 'Minimum wages'],
        documents: ['Aadhar Card', 'Job card', 'Bank account details'],
        icon: '/scheme-icons/mgnrega.png',
      },
    ],
  },
]

export default function SchemesPage() {
  const [selectedMinistry, setSelectedMinistry] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedScheme, setSelectedScheme] = useState<any>(null)
  const bgColor = useColorModeValue('white', 'gray.800')
  const cardBg = useColorModeValue('white', 'gray.700')

  const filteredSchemes = ministries
    .filter((ministry) => !selectedMinistry || ministry.id === selectedMinistry)
    .flatMap((ministry) =>
      ministry.schemes.filter((scheme) =>
        scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )

  const handleSchemeClick = (scheme: any) => {
    setSelectedScheme(scheme)
    onOpen()
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box textAlign="center">
            <Heading
              as="h1"
              size="2xl"
              mb={4}
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              Discover Government Schemes
            </Heading>
            <Text fontSize="xl" color="gray.600">
              Find and apply for government welfare schemes that match your needs
            </Text>
          </Box>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <HStack spacing={4} bg={bgColor} p={4} borderRadius="lg" shadow="md">
            <Select
              placeholder="Select Ministry"
              value={selectedMinistry}
              onChange={(e) => setSelectedMinistry(e.target.value)}
              maxW="300px"
              leftIcon={<FiFilter />}
            >
              {ministries.map((ministry) => (
                <option key={ministry.id} value={ministry.id}>
                  {ministry.name}
                </option>
              ))}
            </Select>

            <InputGroup maxW="500px">
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search schemes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </HStack>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <AnimatePresence>
            {filteredSchemes.map((scheme, index) => (
              <MotionCard
                key={scheme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                cursor="pointer"
                onClick={() => handleSchemeClick(scheme)}
                _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
                transition="all 0.3s"
                bg={cardBg}
              >
                <CardHeader>
                  <HStack spacing={4}>
                    <Image
                      src={scheme.icon}
                      alt={scheme.name}
                      boxSize="50px"
                      fallbackSrc="/scheme-icons/default.png"
                    />
                    <Heading size="md">{scheme.name}</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <Text>{scheme.description}</Text>
                  <HStack mt={4} spacing={2} flexWrap="wrap">
                    {scheme.eligibility.map((item: string) => (
                      <Badge key={item} colorScheme="blue">
                        {item}
                      </Badge>
                    ))}
                  </HStack>
                </CardBody>
                <CardFooter>
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    width="full"
                    rightIcon={<FiArrowRight />}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </MotionCard>
            ))}
          </AnimatePresence>
        </SimpleGrid>

        {/* Scheme Details Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay backdropFilter="blur(10px)" />
          <ModalContent>
            <ModalHeader>
              <HStack spacing={4}>
                <Image
                  src={selectedScheme?.icon}
                  alt={selectedScheme?.name}
                  boxSize="40px"
                  fallbackSrc="/scheme-icons/default.png"
                />
                <Text>{selectedScheme?.name}</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Heading size="sm" mb={2}>
                    Description
                  </Heading>
                  <Text>{selectedScheme?.description}</Text>
                </Box>

                <Box>
                  <Heading size="sm" mb={2}>
                    Eligibility Criteria
                  </Heading>
                  <List spacing={2}>
                    {selectedScheme?.eligibility.map((item: string) => (
                      <ListItem key={item}>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        {item}
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box>
                  <Heading size="sm" mb={2}>
                    Benefits
                  </Heading>
                  <List spacing={2}>
                    {selectedScheme?.benefits.map((item: string) => (
                      <ListItem key={item}>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        {item}
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box>
                  <Heading size="sm" mb={2}>
                    Required Documents
                  </Heading>
                  <List spacing={2}>
                    {selectedScheme?.documents.map((item: string) => (
                      <ListItem key={item}>
                        <ListIcon as={FiFileText} color="blue.500" />
                        {item}
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Link href={`/schemes/apply/${selectedScheme?.id}`} passHref>
                  <Button colorScheme="blue" size="lg" width="full">
                    Apply Now
                  </Button>
                </Link>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  )
} 