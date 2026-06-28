/**
 * WelfareChain deploy script.
 * 1) Deploys SchemeRegistry, UserRegistry, WelfareToken, DisbursementController
 * 2) Wires roles (controller may mint/burn the token)
 * 3) Seeds the illustrative UP scheme catalogue on-chain (amounts + rule hashes)
 * 4) Writes ../backend/chain_artifacts.json (addresses + ABIs + scheme ids)
 *    so the FastAPI backend can talk to the chain with zero manual config.
 */
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Keep ids/order in sync with backend/app/schemes.py
const SCHEMES = [
  { key: "oap",  nameEn: "Old Age Pension",        nameHi: "वृद्धावस्था पेंशन",   amount: 12000 },
  { key: "wid",  nameEn: "Widow Pension",          nameHi: "विधवा पेंशन",        amount: 6000 },
  { key: "div",  nameEn: "Divyangjan Pension",     nameHi: "दिव्यांगजन पेंशन",    amount: 12000 },
  { key: "kny",  nameEn: "Kanya Sumangala Yojana", nameHi: "कन्या सुमंगला योजना", amount: 25000 },
  { key: "kis",  nameEn: "PM-KISAN",               nameHi: "पीएम-किसान",         amount: 6000 },
  { key: "nfsa", nameEn: "Food Subsidy (NFSA)",    nameHi: "खाद्य सब्सिडी (राशन)", amount: 6000 },
  { key: "pmay", nameEn: "Housing (PMAY-G)",       nameHi: "आवास योजना (PMAY-G)", amount: 120000 },
];

async function main() {
  const [admin] = await hre.ethers.getSigners();
  console.log("Deployer/admin:", admin.address);

  const SchemeRegistry = await hre.ethers.getContractFactory("SchemeRegistry");
  const schemes = await SchemeRegistry.deploy(admin.address);
  await schemes.waitForDeployment();

  const UserRegistry = await hre.ethers.getContractFactory("UserRegistry");
  const users = await UserRegistry.deploy(admin.address);
  await users.waitForDeployment();

  const WelfareToken = await hre.ethers.getContractFactory("WelfareToken");
  const token = await WelfareToken.deploy(admin.address);
  await token.waitForDeployment();

  const Controller = await hre.ethers.getContractFactory("DisbursementController");
  const controller = await Controller.deploy(admin.address, token.target, schemes.target);
  await controller.waitForDeployment();

  // Allow the controller to mint/burn welfare tokens
  await (await token.setController(controller.target)).wait();

  // Seed schemes on-chain; record on-chain id per scheme key
  const schemeIds = {};
  for (const s of SCHEMES) {
    const rulesHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes(s.key + ":illustrative-rules:v1"));
    const tx = await schemes.addScheme(s.nameEn, s.nameHi, s.amount, rulesHash);
    await tx.wait();
    schemeIds[s.key] = Number(await schemes.schemeCount());
    console.log(`Scheme seeded: ${s.nameEn} -> on-chain id ${schemeIds[s.key]}`);
  }

  // Export everything the backend needs
  const abiOf = (name) =>
    JSON.parse(
      fs.readFileSync(
        path.join(__dirname, `../artifacts/contracts/${name}.sol/${name}.json`),
        "utf8"
      )
    ).abi;

  const out = {
    rpc: "http://127.0.0.1:8545",
    adminAddress: admin.address,
    addresses: {
      SchemeRegistry: schemes.target,
      UserRegistry: users.target,
      WelfareToken: token.target,
      DisbursementController: controller.target,
    },
    abis: {
      SchemeRegistry: abiOf("SchemeRegistry"),
      UserRegistry: abiOf("UserRegistry"),
      WelfareToken: abiOf("WelfareToken"),
      DisbursementController: abiOf("DisbursementController"),
    },
    schemeIds,
  };

  const dest = path.join(__dirname, "../../backend/chain_artifacts.json");
  fs.writeFileSync(dest, JSON.stringify(out, null, 2));
  console.log("\nWrote", dest);
  console.log("WelfareChain contracts deployed and seeded. Backend is now chain-aware.");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
