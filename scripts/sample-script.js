
const hre = require("hardhat");

async function main() {

  const NFT = await hre.ethers.getContractFactory("NFT");
  const NFTcontract = await NFT.deploy("ipfs://QmWET6J3iv99ppohGwW87xS4x5386RxCZLrPNFHYzMXDY7/");

  await NFTcontract.deployed();

  console.log("NFTcontract deployed to:", NFTcontract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
