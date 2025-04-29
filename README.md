# WelfareChain

A blockchain-based welfare distribution system that ensures transparency, accountability, and efficient management of welfare programs.

## Features

- Smart contract-based welfare token distribution
- Ministry and beneficiary management
- Document verification system
- Audit logging
- Modern and responsive UI
- Real-time transaction tracking
- AI-powered chatbot for scheme discovery

## Tech Stack

- Next.js 13+
- Chakra UI
- Hardhat
- Solidity
- TypeScript
- Gemini AI
- Wagmi
- Ethers.js

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask or any Web3 wallet
- Hardhat (for local blockchain development)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/welfarechain.git
cd welfarechain
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Network Configuration
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=1337

# Contract Addresses (will be filled after deployment)
NEXT_PUBLIC_WELFARE_TOKEN_ADDRESS=
NEXT_PUBLIC_WELFARE_REGISTRY_ADDRESS=
NEXT_PUBLIC_WELFARE_VERIFICATION_ADDRESS=
NEXT_PUBLIC_WELFARE_AUDIT_ADDRESS=
NEXT_PUBLIC_WELFARE_DISTRIBUTION_ADDRESS=
NEXT_PUBLIC_SCHEME_REGISTRY_ADDRESS=
NEXT_PUBLIC_DOCUMENT_VERIFICATION_ADDRESS=
```

## Development

1. Start the local blockchain:

```bash
npx hardhat node
```

2. Deploy the smart contracts:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Configure environment variables in Vercel dashboard
5. Deploy

### Smart Contract Deployment

1. Update the `.env` file with your production network details
2. Deploy to the target network:

```bash
npx hardhat run scripts/deploy.ts --network <network_name>
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
