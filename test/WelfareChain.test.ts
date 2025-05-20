import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { WelfareChain } from "../typechain-types";

describe("WelfareChain", function () {
  let welfareChain: WelfareChain;
  let owner: HardhatEthersSigner;
  let beneficiary: HardhatEthersSigner;
  let admin: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, beneficiary, admin] = await ethers.getSigners();

    const WelfareChain = await ethers.getContractFactory("WelfareChain");
    welfareChain = await WelfareChain.deploy();
    await welfareChain.waitForDeployment();

    // Grant admin role
    const ADMIN_ROLE = await welfareChain.ADMIN_ROLE();
    await welfareChain.grantRole(ADMIN_ROLE, admin.address);
  });

  describe("Beneficiary Management", function () {
    it("Should allow admin to add a beneficiary", async function () {
      await welfareChain.connect(admin).addBeneficiary(
        beneficiary.address,
        "John Doe",
        "1234567890"
      );

      const [name, id, isActive] = await welfareChain.getBeneficiary(beneficiary.address);
      expect(name).to.equal("John Doe");
      expect(id).to.equal("1234567890");
      expect(isActive).to.be.true;
    });

    it("Should not allow non-admin to add a beneficiary", async function () {
      await expect(
        welfareChain.connect(beneficiary).addBeneficiary(
          beneficiary.address,
          "John Doe",
          "1234567890"
        )
      ).to.be.revertedWithCustomError(welfareChain, "AccessControlUnauthorizedAccount");
    });
  });

  describe("Scheme Management", function () {
    it("Should allow admin to add a scheme", async function () {
      await welfareChain.connect(admin).addScheme(
        "Food Security",
        "Provides food assistance to eligible beneficiaries",
        ethers.parseEther("1000"),
        100
      );

      const [name, description, budget, maxBeneficiaries, isActive] = await welfareChain.getScheme(1);
      expect(name).to.equal("Food Security");
      expect(description).to.equal("Provides food assistance to eligible beneficiaries");
      expect(budget).to.equal(ethers.parseEther("1000"));
      expect(maxBeneficiaries).to.equal(100);
      expect(isActive).to.be.true;
    });

    it("Should not allow non-admin to add a scheme", async function () {
      await expect(
        welfareChain.connect(beneficiary).addScheme(
          "Food Security",
          "Provides food assistance to eligible beneficiaries",
          ethers.parseEther("1000"),
          100
        )
      ).to.be.revertedWithCustomError(welfareChain, "AccessControlUnauthorizedAccount");
    });
  });

  describe("Application Process", function () {
    beforeEach(async function () {
      // Setup: Add beneficiary and scheme
      await welfareChain.connect(admin).addBeneficiary(
        beneficiary.address,
        "John Doe",
        "1234567890"
      );
      await welfareChain.connect(admin).addScheme(
        "Food Security",
        "Provides food assistance to eligible beneficiaries",
        ethers.parseEther("1000"),
        100
      );
    });

    it("Should allow beneficiary to apply for a scheme", async function () {
      await welfareChain.connect(beneficiary).applyForScheme(1);
      expect(await welfareChain.hasApplied(beneficiary.address, 1)).to.be.true;
    });

    it("Should not allow non-beneficiary to apply", async function () {
      const [random] = await ethers.getSigners();
      await expect(
        welfareChain.connect(random).applyForScheme(1)
      ).to.be.revertedWith("Not a registered beneficiary");
    });

    it("Should allow admin to approve application", async function () {
      await welfareChain.connect(beneficiary).applyForScheme(1);
      await welfareChain.connect(admin).approveApplication(beneficiary.address, 1);
      expect(await welfareChain.isApproved(beneficiary.address, 1)).to.be.true;
    });

    it("Should not allow non-admin to approve application", async function () {
      await welfareChain.connect(beneficiary).applyForScheme(1);
      await expect(
        welfareChain.connect(beneficiary).approveApplication(beneficiary.address, 1)
      ).to.be.revertedWithCustomError(welfareChain, "AccessControlUnauthorizedAccount");
    });
  });
}); 