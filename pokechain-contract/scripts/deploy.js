const hre = require("hardhat");

async function main() {
  const Ballot = await hre.ethers.getContractFactory("PokeChain");
  const ballot = await Ballot.deploy();
  await ballot.deployed();
  console.log("Pokechain deployed to:", ballot.address);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
