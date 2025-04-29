import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { WelfareAudit, WelfareToken } from "../typechain-types";

describe("WelfareAudit", function () {
  let welfareAudit: WelfareAudit;
  let welfareToken: WelfareToken;
  let owner: SignerWithAddress;
  let ministry: SignerWithAddress;
  let beneficiary: SignerWithAddress;
  let other: SignerWithAddress;

  beforeEach(async function () {
    [owner, ministry, beneficiary, other] = await ethers.getSigners();
    
    // Deploy WelfareToken
    const WelfareToken = await ethers.getContractFactory("WelfareToken");
    welfareToken = await WelfareToken.deploy();
    await welfareToken.deployed();

    // Deploy WelfareAudit
    const WelfareAudit = await ethers.getContractFactory("WelfareAudit");
    welfareAudit = await WelfareAudit.deploy(welfareToken.address);
    await welfareAudit.deployed();

    // Register ministry
    await welfareToken.connect(owner).registerMinistry(ministry.address);
  });

  describe("Contract Deployment", function () {
    it("Should set the correct token address", async function () {
      expect(await welfareAudit.welfareToken()).to.equal(welfareToken.address);
    });

    it("Should set the correct owner", async function () {
      expect(await welfareAudit.owner()).to.equal(owner.address);
    });
  });

  describe("Ministry Management", function () {
    it("Should allow owner to register ministry", async function () {
      await welfareAudit.connect(owner).registerMinistry(ministry.address);
      expect(await welfareAudit.isMinistry(ministry.address)).to.be.true;
    });

    it("Should not allow non-owner to register ministry", async function () {
      await expect(
        welfareAudit.connect(other).registerMinistry(ministry.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow duplicate ministry registration", async function () {
      await welfareAudit.connect(owner).registerMinistry(ministry.address);
      await expect(
        welfareAudit.connect(owner).registerMinistry(ministry.address)
      ).to.be.revertedWith("Address is already a ministry");
    });
  });

  describe("Audit Log Management", function () {
    beforeEach(async function () {
      await welfareAudit.connect(owner).registerMinistry(ministry.address);
    });

    it("Should allow ministry to create audit log", async function () {
      const program = "Food Assistance";
      const amount = ethers.utils.parseEther("500");
      const date = Math.floor(Date.now() / 1000);
      const description = "Monthly food assistance distribution";

      await welfareAudit.connect(ministry).createAuditLog(
        program,
        amount,
        date,
        description
      );

      const log = await welfareAudit.getAuditLog(0);
      expect(log.ministry).to.equal(ministry.address);
      expect(log.program).to.equal(program);
      expect(log.amount).to.equal(amount);
      expect(log.date).to.equal(date);
      expect(log.description).to.equal(description);
    });

    it("Should not allow non-ministry to create audit log", async function () {
      await expect(
        welfareAudit.connect(other).createAuditLog(
          "Food Assistance",
          ethers.utils.parseEther("500"),
          Math.floor(Date.now() / 1000),
          "Monthly food assistance distribution"
        )
      ).to.be.revertedWith("Caller is not a ministry");
    });

    it("Should not allow creating audit log with zero amount", async function () {
      await expect(
        welfareAudit.connect(ministry).createAuditLog(
          "Food Assistance",
          0,
          Math.floor(Date.now() / 1000),
          "Monthly food assistance distribution"
        )
      ).to.be.revertedWith("Amount must be greater than zero");
    });
  });

  describe("Audit Log Retrieval", function () {
    beforeEach(async function () {
      await welfareAudit.connect(owner).registerMinistry(ministry.address);
      await welfareAudit.connect(ministry).createAuditLog(
        "Food Assistance",
        ethers.utils.parseEther("500"),
        Math.floor(Date.now() / 1000),
        "Monthly food assistance distribution"
      );
    });

    it("Should return correct audit log count", async function () {
      expect(await welfareAudit.getAuditLogCount()).to.equal(1);
    });

    it("Should return correct audit log by index", async function () {
      const log = await welfareAudit.getAuditLog(0);
      expect(log.ministry).to.equal(ministry.address);
      expect(log.program).to.equal("Food Assistance");
      expect(log.amount).to.equal(ethers.utils.parseEther("500"));
    });

    it("Should revert when accessing non-existent audit log", async function () {
      await expect(welfareAudit.getAuditLog(1)).to.be.revertedWith("Invalid audit log index");
    });
  });

  describe("Ministry Audit Logs", function () {
    beforeEach(async function () {
      await welfareAudit.connect(owner).registerMinistry(ministry.address);
      await welfareAudit.connect(ministry).createAuditLog(
        "Food Assistance",
        ethers.utils.parseEther("500"),
        Math.floor(Date.now() / 1000),
        "Monthly food assistance distribution"
      );
    });

    it("Should return correct ministry audit log count", async function () {
      expect(await welfareAudit.getMinistryAuditLogCount(ministry.address)).to.equal(1);
    });

    it("Should return correct ministry audit log by index", async function () {
      const log = await welfareAudit.getMinistryAuditLog(ministry.address, 0);
      expect(log.ministry).to.equal(ministry.address);
      expect(log.program).to.equal("Food Assistance");
      expect(log.amount).to.equal(ethers.utils.parseEther("500"));
    });

    it("Should revert when accessing non-existent ministry audit log", async function () {
      await expect(welfareAudit.getMinistryAuditLog(ministry.address, 1)).to.be.revertedWith("Invalid ministry audit log index");
    });

    it("Should return zero count for ministry with no audit logs", async function () {
      expect(await welfareAudit.getMinistryAuditLogCount(other.address)).to.equal(0);
    });
  });
}); 