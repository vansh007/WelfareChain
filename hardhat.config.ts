import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

// Optional validation only if Sepolia values are used
const sepoliaConfig =
  PRIVATE_KEY && SEPOLIA_RPC_URL
    ? {
        sepolia: {
          url: SEPOLIA_RPC_URL,
          accounts:
            PRIVATE_KEY.length === 66 && PRIVATE_KEY.startsWith("0x")
              ? [PRIVATE_KEY]
              : (() => {
                  throw new Error(
                    "❌ PRIVATE_KEY is invalid (must be 66 characters including '0x')"
                  );
                })(),
        },
      }
    : {};

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    ...sepoliaConfig,
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY || "",
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};

export default config;
