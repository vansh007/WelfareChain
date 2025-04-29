import {
  Box,
  Flex,
  HStack,
  IconButton,
  useColorMode,
  useColorModeValue,
  Text,
  Button,
} from "@chakra-ui/react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      px={4}
      borderBottom="1px"
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold">
          WelfareChain
        </Text>

        <HStack spacing={4}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            variant="ghost"
          />

          {isConnected ? (
            <Button
              onClick={() => disconnect()}
              variant="outline"
              colorScheme="brand"
            >
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </Button>
          ) : (
            <Button onClick={() => connect()} colorScheme="brand">
              Connect Wallet
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar; 