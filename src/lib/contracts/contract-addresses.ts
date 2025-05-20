export const WelfareChainAddress = {
  // Add your deployed contract addresses here
  sepolia: '0x...', // Replace with your deployed contract address
  mainnet: '0x...', // Replace with your deployed contract address
  localhost: '0x...', // Replace with your local contract address
}[process.env.NEXT_PUBLIC_NETWORK || 'localhost']; 