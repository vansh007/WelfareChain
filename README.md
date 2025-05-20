# WelfareChain

WelfareChain is a blockchain-based platform revolutionizing welfare distribution through transparent, secure, and efficient delivery of government schemes to citizens.

## Features

- 🔐 Secure wallet-based authentication
- 📱 Modern, responsive user interface
- 📊 Real-time dashboard for scheme tracking
- 📄 Document management system
- 📈 Analytics and reporting
- 🔄 Transparent transaction history

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: MetaMask Wallet Integration
- **State Management**: React Hooks
- **Blockchain**: Ethereum (MetaMask)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- MetaMask browser extension
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/welfarechain.git
cd welfarechain
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
welfarechain/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── (dashboard)/    # Dashboard routes
│   │   ├── auth/          # Authentication routes
│   │   └── api/           # API routes
│   ├── components/         # React components
│   │   ├── ui/            # UI components
│   │   └── layout/        # Layout components
│   ├── lib/               # Utility functions
│   └── styles/            # Global styles
├── public/                # Static assets
└── package.json          # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [MetaMask](https://metamask.io/)
