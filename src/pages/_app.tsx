import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { mainnet, hardhat } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import type { AppProps } from "next/app";
import theme from "../theme/theme";
import Layout from "../components/Layout";
import { CacheProvider } from "@chakra-ui/next-js";

const { chains, publicClient } = configureChains(
  [mainnet, hardhat],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors: [new MetaMaskConnector({ chains })],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CacheProvider>
      <WagmiConfig config={config}>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </WagmiConfig>
    </CacheProvider>
  );
} 