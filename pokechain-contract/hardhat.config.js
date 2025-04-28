require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
  localhost: {
  url: "http://127.0.0.1:8645",
  },
  sepolia: {
  url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.INFURA_API_KEY}`,
  accounts: [`0x${process.env.PRIVATE_KEY}`],
  },
  },
  };