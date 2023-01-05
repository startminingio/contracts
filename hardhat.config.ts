import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.17', settings: {optimizer: {enabled: true}}
      }
    ],
  },
  networks: {
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [`0x${process.env.PRIVATE_KEY_TEST}`],
      gasPrice: 18000000000,
    },
    mainnet: {
      url: process.env.MAINNET_URL,
      accounts: [`0x${process.env.PRIVATE_KEY_PROD}`],
      gasPrice: 18000000000
    }
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_KEY!,
    },
  },paths: {
    artifacts: "./artifacts"
  }
};

export default config;
