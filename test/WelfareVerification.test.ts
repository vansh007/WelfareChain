import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { WelfareVerification, WelfareToken } from "../typechain-types";

describe("WelfareVerification", function () {
  let welfareVerification: WelfareVerification;
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

    // Deploy WelfareVerification
    const WelfareVerification = await ethers.getContractFactory("WelfareVerification");
    welfareVerification = await WelfareVerification.deploy(welfareToken.address);
    await welfareVerification.deployed();

    // Register ministry
    await welfareToken.connect(owner).registerMinistry(ministry.address);
  });

  describe("Contract Deployment", function () {
    it("Should set the correct token address", async function () {
      expect(await welfareVerification.welfareToken()).to.equal(welfareToken.address);
    });

    it("Should set the correct owner", async function () {
      expect(await welfareVerification.owner()).to.equal(owner.address);
    });
  });

  describe("Ministry Management", function () {
    it("Should allow owner to register ministry", async function () {
      await welfareVerification.connect(owner).registerMinistry(ministry.address);
      expect(await welfareVerification.isMinistry(ministry.address)).to.be.true;
    });

    it("Should not allow non-owner to register ministry", async function () {
      await expect(
        welfareVerification.connect(other).registerMinistry(ministry.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow duplicate ministry registration", async function () {
      await welfareVerification.connect(owner).registerMinistry(ministry.address);
      await expect(
        welfareVerification.connect(owner).registerMinistry(ministry.address)
      ).to.be.revertedWith("Address is already a ministry");
    });
  });

  describe("Beneficiary Management", function () {
    beforeEach(async function () {
      await welfareVerification.connect(owner).registerMinistry(ministry.address);
    });

    it("Should allow ministry to register beneficiary", async function () {
      await welfareVerification.connect(ministry).registerBeneficiary(beneficiary.address);
      expect(await welfareVerification.isBeneficiary(beneficiary.address)).to.be.true;
    });

    it("Should not allow non-ministry to register beneficiary", async function () {
      await expect(
        welfareVerification.connect(other).registerBeneficiary(beneficiary.address)
      ).to.be.revertedWith("Caller is not a ministry");
    });

    it("Should not allow duplicate beneficiary registration", async function () {
      await welfareVerification.connect(ministry).registerBeneficiary(beneficiary.address);
      await expect(
        welfareVerification.connect(ministry).registerBeneficiary(beneficiary.address)
      ).to.be.revertedWith("Address is already a beneficiary");
    });
  });

  describe("Document Verification", function () {
    beforeEach(async function () {
      await welfareVerification.connect(owner).registerMinistry(ministry.address);
      await welfareVerification.connect(ministry).registerBeneficiary(beneficiary.address);
    });

    it("Should allow ministry to verify beneficiary documents", async function () {
      const documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test-document"));
      await welfareVerification.connect(ministry).verifyDocuments(beneficiary.address, documentHash);
      
      expect(await welfareVerification.isVerified(beneficiary.address)).to.be.true;
      expect(await welfareVerification.getVerificationHash(beneficiary.address)).to.equal(documentHash);
    });

    it("Should not allow non-ministry to verify documents", async function () {
      const documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test-document"));
      await expect(
        welfareVerification.connect(other).verifyDocuments(beneficiary.address, documentHash)
      ).to.be.revertedWith("Caller is not a ministry");
    });

    it("Should not allow verification of non-beneficiary", async function () {
      const documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test-document"));
      await expect(
        welfareVerification.connect(ministry).verifyDocuments(other.address, documentHash)
      ).to.be.revertedWith("Address is not a beneficiary");
    });

    it("Should not allow verification with empty document hash", async function () {
      await expect(
        welfareVerification.connect(ministry).verifyDocuments(beneficiary.address, ethers.constants.HashZero)
      ).to.be.revertedWith("Document hash cannot be empty");
    });
  });

  describe("Verification Status", function () {
    beforeEach(async function () {
      await welfareVerification.connect(owner).registerMinistry(ministry.address);
      await welfareVerification.connect(ministry).registerBeneficiary(beneficiary.address);
    });

    it("Should return correct verification status", async function () {
      expect(await welfareVerification.isVerified(beneficiary.address)).to.be.false;
      
      const documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test-document"));
      await welfareVerification.connect(ministry).verifyDocuments(beneficiary.address, documentHash);
      
      expect(await welfareVerification.isVerified(beneficiary.address)).to.be.true;
    });

    it("Should return correct verification hash", async function () {
      const documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test-document"));
      await welfareVerification.connect(ministry).verifyDocuments(beneficiary.address, documentHash);
      
      expect(await welfareVerification.getVerificationHash(beneficiary.address)).to.equal(documentHash);
    });

    it("Should return zero hash for unverified beneficiary", async function () {
      expect(await welfareVerification.getVerificationHash(beneficiary.address)).to.equal(ethers.constants.HashZero);
    });
  });
}); 