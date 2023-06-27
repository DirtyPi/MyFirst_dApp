// require("@nomicfoundation/hardhat-toolbox");
// // Import and configure dotenv
// require("dotenv").config();

// module.exports = {
//   solidity: "0.8.17",
//   networks: {
//     goerli: {
//       // This value will be replaced on runtime
//       url: process.env.STAGING_QUICKNODE_KEY,
//       accounts: [process.env.PRIVATE_KEY],
//     },
//     mainnet: {
//       url: process.env.PROD_QUICKNODE_KEY,
//       accounts: [process.env.PRIVATE_KEY],
//     },
//   },
// };

require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: process.env.STAGING_QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};