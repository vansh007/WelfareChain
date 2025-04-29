import { ethers } from "hardhat";

async function main() {
  console.log("Deploying WelfareChain contracts...");

  // Deploy WelfareToken
  const WelfareToken = await ethers.getContractFactory("WelfareToken");
  const welfareToken = await WelfareToken.deploy();
  await welfareToken.waitForDeployment();
  console.log("WelfareToken deployed to:", await welfareToken.getAddress());

  // Deploy WelfareRegistry
  const WelfareRegistry = await ethers.getContractFactory("WelfareRegistry");
  const welfareRegistry = await WelfareRegistry.deploy();
  await welfareRegistry.waitForDeployment();
  console.log("WelfareRegistry deployed to:", await welfareRegistry.getAddress());

  // Deploy WelfareVerification
  const WelfareVerification = await ethers.getContractFactory("WelfareVerification");
  const welfareVerification = await WelfareVerification.deploy(await welfareToken.getAddress());
  await welfareVerification.waitForDeployment();
  console.log("WelfareVerification deployed to:", await welfareVerification.getAddress());

  // Deploy WelfareAudit
  const WelfareAudit = await ethers.getContractFactory("WelfareAudit");
  const welfareAudit = await WelfareAudit.deploy(await welfareToken.getAddress());
  await welfareAudit.waitForDeployment();
  console.log("WelfareAudit deployed to:", await welfareAudit.getAddress());

  // Deploy WelfareDistribution
  const WelfareDistribution = await ethers.getContractFactory("WelfareDistribution");
  const welfareDistribution = await WelfareDistribution.deploy(await welfareToken.getAddress());
  await welfareDistribution.waitForDeployment();
  console.log("WelfareDistribution deployed to:", await welfareDistribution.getAddress());

  // Deploy SchemeRegistry
  const SchemeRegistry = await ethers.getContractFactory("SchemeRegistry");
  const schemeRegistry = await SchemeRegistry.deploy();
  await schemeRegistry.waitForDeployment();
  console.log("SchemeRegistry deployed to:", await schemeRegistry.getAddress());

  // Deploy DocumentVerification
  const DocumentVerification = await ethers.getContractFactory("DocumentVerification");
  const documentVerification = await DocumentVerification.deploy();
  await documentVerification.waitForDeployment();
  console.log("DocumentVerification deployed to:", await documentVerification.getAddress());

  console.log("All contracts deployed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 