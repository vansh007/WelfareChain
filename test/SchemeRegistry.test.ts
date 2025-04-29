import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { SchemeRegistry } from "../typechain-types";

describe("SchemeRegistry", function () {
  let schemeRegistry: SchemeRegistry;
  let owner: SignerWithAddress;
  let ministry: SignerWithAddress;
  let user: SignerWithAddress;

  beforeEach(async function () {
    [owner, ministry, user] = await ethers.getSigners();
    const SchemeRegistry = await ethers.getContractFactory("SchemeRegistry");
    schemeRegistry = await SchemeRegistry.deploy();
    await schemeRegistry.deployed();
  });

  describe("Ministry Registration", function () {
    it("Should allow ministry registration", async function () {
      await schemeRegistry.connect(ministry).registerMinistry("Test Ministry");
      const isRegistered = await schemeRegistry.isMinistryRegistered(ministry.address);
      expect(isRegistered).to.be.true;
    });

    it("Should not allow duplicate ministry registration", async function () {
      await schemeRegistry.connect(ministry).registerMinistry("Test Ministry");
      await expect(
        schemeRegistry.connect(ministry).registerMinistry("Test Ministry 2")
      ).to.be.revertedWith("Ministry already registered");
    });
  });

  describe("Scheme Management", function () {
    beforeEach(async function () {
      await schemeRegistry.connect(ministry).registerMinistry("Test Ministry");
    });

    it("Should allow ministry to create scheme", async function () {
      const tx = await schemeRegistry.connect(ministry).createScheme(
        "Test Scheme",
        "Test Description",
        100
      );
      await tx.wait();

      const schemeId = await schemeRegistry.getSchemeId("Test Scheme");
      const scheme = await schemeRegistry.getSchemeDetails(schemeId);
      
      expect(scheme.name).to.equal("Test Scheme");
      expect(scheme.description).to.equal("Test Description");
      expect(scheme.maxBeneficiaries).to.equal(100);
    });

    it("Should not allow non-ministry to create scheme", async function () {
      await expect(
        schemeRegistry.connect(user).createScheme(
          "Test Scheme",
          "Test Description",
          100
        )
      ).to.be.revertedWith("Only registered ministries can create schemes");
    });
  });

  describe("Application Process", function () {
    let schemeId: string;

    beforeEach(async function () {
      await schemeRegistry.connect(ministry).registerMinistry("Test Ministry");
      const tx = await schemeRegistry.connect(ministry).createScheme(
        "Test Scheme",
        "Test Description",
        100
      );
      await tx.wait();
      schemeId = await schemeRegistry.getSchemeId("Test Scheme");
    });

    it("Should allow user to apply for scheme", async function () {
      await schemeRegistry.connect(user).applyForScheme(schemeId);
      const applications = await schemeRegistry.getUserApplications(user.address);
      expect(applications).to.include(schemeId);
    });

    it("Should allow ministry to approve application", async function () {
      await schemeRegistry.connect(user).applyForScheme(schemeId);
      await schemeRegistry.connect(ministry).approveApplication(schemeId, user.address);
      const isBeneficiary = await schemeRegistry.isBeneficiary(schemeId, user.address);
      expect(isBeneficiary).to.be.true;
    });

    it("Should allow ministry to reject application", async function () {
      await schemeRegistry.connect(user).applyForScheme(schemeId);
      await schemeRegistry.connect(ministry).rejectApplication(schemeId, user.address);
      const isBeneficiary = await schemeRegistry.isBeneficiary(schemeId, user.address);
      expect(isBeneficiary).to.be.false;
    });
  });
}); 