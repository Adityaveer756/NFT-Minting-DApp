const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", function () {
  it("", async function () {
    const NFTcontract = await ethers.getContractFactory("NFT");
    const nftContract = await NFTcontract.deploy("Hello, world!");
    await nftContract.deployed();

    /*expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");*/
  });
});
