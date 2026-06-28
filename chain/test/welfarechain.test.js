const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WelfareChain contracts", function () {
  let admin, citizen, outsider, schemes, users, token, controller;
  const appId = ethers.keccak256(ethers.toUtf8Bytes("app-001"));

  beforeEach(async () => {
    [admin, citizen, outsider] = await ethers.getSigners();

    schemes = await (await ethers.getContractFactory("SchemeRegistry")).deploy(admin.address);
    users = await (await ethers.getContractFactory("UserRegistry")).deploy(admin.address);
    token = await (await ethers.getContractFactory("WelfareToken")).deploy(admin.address);
    controller = await (
      await ethers.getContractFactory("DisbursementController")
    ).deploy(admin.address, token.target, schemes.target);

    await token.setController(controller.target);
    await schemes.addScheme("Old Age Pension", "वृद्धावस्था पेंशन", 12000,
      ethers.keccak256(ethers.toUtf8Bytes("oap:v1")));
  });

  it("registers a citizen by identity commitment (no raw identity on-chain)", async () => {
    const commit = ethers.keccak256(ethers.toUtf8Bytes("mock-aadhaar-1234:salt"));
    await expect(users.register(commit, citizen.address))
      .to.emit(users, "UserRegistered").withArgs(commit, citizen.address);
    expect(await users.walletOf(commit)).to.equal(citizen.address);
  });

  it("runs the full lifecycle: record -> approve -> disburse (mint, convert/burn, fiatRef)", async () => {
    await controller.recordVerifiedApplication(appId, citizen.address, 1, 9700, true, "");
    await controller.approveAndAuthorize(appId);

    const tx = controller.disburse(appId);
    await expect(tx).to.emit(controller, "TokenMinted").withArgs(appId, citizen.address, 12000);
    await expect(tx).to.emit(controller, "TokenConverted").withArgs(appId, 12000);
    await expect(tx).to.emit(controller, "Disbursed");

    // Token is transient: minted then burned on fiat conversion
    expect(await token.balanceOf(citizen.address)).to.equal(0);
    expect((await controller.disbursements(appId)).status).to.equal(3); // Disbursed
  });

  it("routes failed verification to human review, then resolves (ethical-AI fallback)", async () => {
    await expect(
      controller.recordVerifiedApplication(appId, citizen.address, 1, 3400, false, "tamper_detected")
    ).to.emit(controller, "FlaggedForReview").withArgs(appId, "tamper_detected");

    expect((await controller.disbursements(appId)).status).to.equal(4); // FlaggedForReview

    await controller.resolveReview(appId, true, "human approved");
    await controller.approveAndAuthorize(appId);
    await controller.disburse(appId);
    expect((await controller.disbursements(appId)).status).to.equal(3);
  });

  it("enforces role separation (RBAC) and blocks double disbursement", async () => {
    await controller.recordVerifiedApplication(appId, citizen.address, 1, 9700, true, "");
    await controller.approveAndAuthorize(appId);

    await expect(controller.connect(outsider).disburse(appId)).to.be.reverted; // no TREASURY_ROLE
    await controller.disburse(appId);
    await expect(controller.disburse(appId)).to.be.revertedWith("Controller: not approved");
  });

  it("only the controller can mint/burn the welfare token", async () => {
    await expect(token.connect(outsider).mintTo(citizen.address, 1)).to.be.reverted;
  });
});
