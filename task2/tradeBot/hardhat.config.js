require("@nomiclabs/hardhat-ethers");

const INFURA_API_KEY = "c311832efaec4c8ab861e531e83585c0";

module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      },
    },
  },
  solidity: "0.7.4",
};

