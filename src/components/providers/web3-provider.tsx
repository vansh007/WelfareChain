"use client";


import { WelfareChainABI } from '@/lib/contracts/welfare-chain-abi';
import { WelfareChainAddress } from '@/lib/contracts/contract-addresses';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, sepolia],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
  ],
  publicClient,
  webSocketPublicClient,
});

export const contractConfig = {
  address: WelfareChainAddress as `0x${string}`,
  abi: WelfareChainABI,
};

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return <>;
} 