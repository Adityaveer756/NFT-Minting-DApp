require("@nomiclabs/hardhat-waffle");

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
const { RINKEBY_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "rinkeby",
  networks: {
     hardhat: {},
     rinkeby: {
        url: RINKEBY_RPC_URL,
        accounts: [`0x${PRIVATE_KEY}`]
     }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
