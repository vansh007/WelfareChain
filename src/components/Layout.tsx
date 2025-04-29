import { Box, Container, Flex, useColorMode } from "@chakra-ui/react";
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { colorMode } = useColorMode();

  return (
    <Box minH="100vh" bg={colorMode === "light" ? "gray.50" : "gray.900"}>
      <Navbar />
      <Flex>
        <Sidebar />
        <Container maxW="container.xl" py={8}>
          {children}
        </Container>
      </Flex>
    </Box>
  );
};

export default Layout; 