import { ethers } from "hardhat";
import { Contract } from "ethers";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);

  // Deployment Order:
  // 1. WelfareToken (needed by multiple contracts)
  // 2. DocumentVerification (standalone)
  // 3. EligibilityVerification (standalone)
  // 4. SchemeRegistry (standalone)
  // 5. WelfareRegistry (standalone)
  // 6. WelfareVerification (needs WelfareToken)
  // 7. WelfareAudit (needs WelfareToken)
  // 8. WelfareDistribution (needs WelfareToken)

  // 1. Deploy WelfareToken
  console.log("Deploying WelfareToken...");
  const WelfareToken = await ethers.getContractFactory("WelfareToken");
  const welfareToken = await WelfareToken.deploy();
  await welfareToken.waitForDeployment();
  console.log(`WelfareToken deployed to: ${await welfareToken.getAddress()}`);

  // 2. Deploy DocumentVerification
  console.log("Deploying DocumentVerification...");
  const DocumentVerification = await ethers.getContractFactory("DocumentVerification");
  const documentVerification = await DocumentVerification.deploy();
  await documentVerification.waitForDeployment();
  console.log(`DocumentVerification deployed to: ${await documentVerification.getAddress()}`);

  // 3. Deploy EligibilityVerification
  console.log("Deploying EligibilityVerification...");
  const EligibilityVerification = await ethers.getContractFactory("EligibilityVerification");
  const eligibilityVerification = await EligibilityVerification.deploy();
  await eligibilityVerification.waitForDeployment();
  console.log(`EligibilityVerification deployed to: ${await eligibilityVerification.getAddress()}`);

  // 4. Deploy SchemeRegistry
  console.log("Deploying SchemeRegistry...");
  const SchemeRegistry = await ethers.getContractFactory("SchemeRegistry");
  const schemeRegistry = await SchemeRegistry.deploy();
  await schemeRegistry.waitForDeployment();
  console.log(`SchemeRegistry deployed to: ${await schemeRegistry.getAddress()}`);

  // 5. Deploy WelfareRegistry
  console.log("Deploying WelfareRegistry...");
  const WelfareRegistry = await ethers.getContractFactory("WelfareRegistry");
  const welfareRegistry = await WelfareRegistry.deploy();
  await welfareRegistry.waitForDeployment();
  console.log(`WelfareRegistry deployed to: ${await welfareRegistry.getAddress()}`);

  // 6. Deploy WelfareVerification (requires WelfareToken)
  console.log("Deploying WelfareVerification...");
  const WelfareVerification = await ethers.getContractFactory("WelfareVerification");
  const welfareVerification = await WelfareVerification.deploy(await welfareToken.getAddress());
  await welfareVerification.waitForDeployment();
  console.log(`WelfareVerification deployed to: ${await welfareVerification.getAddress()}`);

  // 7. Deploy WelfareAudit (requires WelfareToken)
  console.log("Deploying WelfareAudit...");
  const WelfareAudit = await ethers.getContractFactory("WelfareAudit");
  const welfareAudit = await WelfareAudit.deploy(await welfareToken.getAddress());
  await welfareAudit.waitForDeployment();
  console.log(`WelfareAudit deployed to: ${await welfareAudit.getAddress()}`);

  // 8. Deploy WelfareDistribution (requires WelfareToken)
  console.log("Deploying WelfareDistribution...");
  const WelfareDistribution = await ethers.getContractFactory("WelfareDistribution");
  const welfareDistribution = await WelfareDistribution.deploy(await welfareToken.getAddress());
  await welfareDistribution.waitForDeployment();
  console.log(`WelfareDistribution deployed to: ${await welfareDistribution.getAddress()}`);

  // Optional: Initialize some contracts with each other if needed
  // Example: Set WelfareVerification in WelfareToken if needed
  // await welfareToken.setVerificationContract(await welfareVerification.getAddress());

  console.log("\n=== Deployment Complete ===");
  console.log("WelfareToken:", await welfareToken.getAddress());
  console.log("DocumentVerification:", await documentVerification.getAddress());
  console.log("EligibilityVerification:", await eligibilityVerification.getAddress());
  console.log("SchemeRegistry:", await schemeRegistry.getAddress());
  console.log("WelfareRegistry:", await welfareRegistry.getAddress());
  console.log("WelfareVerification:", await welfareVerification.getAddress());
  console.log("WelfareAudit:", await welfareAudit.getAddress());
  console.log("WelfareDistribution:", await welfareDistribution.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });