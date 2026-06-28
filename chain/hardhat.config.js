require("@nomicfoundation/hardhat-toolbox");

/** WelfareChain simulation chain config (Decision D-1: local EVM). */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    localhost: { url: "http://127.0.0.1:8545" },
  },
};
