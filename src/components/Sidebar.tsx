import {
  Box,
  VStack,
  Link,
  Text,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiSettings,
  FiBarChart2,
} from "react-icons/fi";
import { useRouter } from "next/router";
import NextLink from "next/link";

const Sidebar = () => {
  const router = useRouter();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const menuItems = [
    { icon: FiHome, label: "Dashboard", path: "/" },
    { icon: FiUsers, label: "Beneficiaries", path: "/beneficiaries" },
    { icon: FiFileText, label: "Documents", path: "/documents" },
    { icon: FiBarChart2, label: "Analytics", path: "/analytics" },
    { icon: FiSettings, label: "Settings", path: "/settings" },
  ];

  return (
    <Box
      w={64}
      h="calc(100vh - 4rem)"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      py={4}
    >
      <VStack spacing={1} align="stretch">
        {menuItems.map((item) => (
          <NextLink key={item.path} href={item.path} passHref>
            <Link
              display="flex"
              alignItems="center"
              px={4}
              py={2}
              color={router.pathname === item.path ? "brand.500" : "gray.600"}
              _hover={{
                bg: "gray.50",
                color: "brand.500",
              }}
            >
              <Icon as={item.icon} mr={3} />
              <Text>{item.label}</Text>
            </Link>
          </NextLink>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar; 