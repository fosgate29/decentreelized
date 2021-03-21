// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is avaialble in the global scope (Token.sol smart contract)
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();

  console.log("Token address:", token.address);

  // TreeCampaignVault.sol smart contract
  const [deployer_1] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer_1.getAddress()
  );
  const _wallet = await ethers.Wallet.createRandom();
  const TreeCampaignVault = await ethers.getContractFactory("TreeCampaignVault");
  const treeCampaignVault = await TreeCampaignVault.deploy(_wallet.address);
  await treeCampaignVault.deployed();

  console.log("TreeCampaignVault address:", treeCampaignVault.address);

  // TreeCampaign.sol smart contract
  const [deployer_2] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer_2.getAddress()
  );

  const TreeCampaign = await ethers.getContractFactory("TreeCampaign");
  const treeCampaign = await TreeCampaign.deploy(_wallet.address);
  await treeCampaign.deployed();

  console.log("TreeCampaign address:", treeCampaign.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(token);
}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("Token");

  fs.writeFileSync(
    contractsDir + "/Token.json",
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
