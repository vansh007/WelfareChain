import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { WelfareDistribution, WelfareToken } from "../typechain-types";

describe("WelfareDistribution", function () {
  let welfareDistribution: WelfareDistribution;
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

    // Deploy WelfareDistribution
    const WelfareDistribution = await ethers.getContractFactory("WelfareDistribution");
    welfareDistribution = await WelfareDistribution.deploy(welfareToken.address);
    await welfareDistribution.deployed();

    // Register ministry and transfer tokens to distribution contract
    await welfareToken.connect(owner).registerMinistry(ministry.address);
    const amount = ethers.utils.parseEther("1000");
    await welfareToken.connect(owner).transfer(welfareDistribution.address, amount);
  });

  describe("Contract Deployment", function () {
    it("Should set the correct token address", async function () {
      expect(await welfareDistribution.welfareToken()).to.equal(welfareToken.address);
    });

    it("Should set the correct owner", async function () {
      expect(await welfareDistribution.owner()).to.equal(owner.address);
    });
  });

  describe("Ministry Management", function () {
    it("Should allow owner to register ministry", async function () {
      await welfareDistribution.connect(owner).registerMinistry(ministry.address);
      expect(await welfareDistribution.isMinistry(ministry.address)).to.be.true;
    });

    it("Should not allow non-owner to register ministry", async function () {
      await expect(
        welfareDistribution.connect(other).registerMinistry(ministry.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow duplicate ministry registration", async function () {
      await welfareDistribution.connect(owner).registerMinistry(ministry.address);
      await expect(
        welfareDistribution.connect(owner).registerMinistry(ministry.address)
      ).to.be.revertedWith("Address is already a ministry");
    });
  });

  describe("Beneficiary Management", function () {
    beforeEach(async function () {
      await welfareDistribution.connect(owner).registerMinistry(ministry.address);
    });

    it("Should allow ministry to register beneficiary", async function () {
      await welfareDistribution.connect(ministry).registerBeneficiary(beneficiary.address);
      expect(await welfareDistribution.isBeneficiary(beneficiary.address)).to.be.true;
    });

    it("Should not allow non-ministry to register beneficiary", async function () {
      await expect(
        welfareDistribution.connect(other).registerBeneficiary(beneficiary.address)
      ).to.be.revertedWith("Caller is not a ministry");
    });

    it("Should not allow duplicate beneficiary registration", async function () {
      await welfareDistribution.connect(ministry).registerBeneficiary(beneficiary.address);
      await expect(
        welfareDistribution.connect(ministry).registerBeneficiary(beneficiary.address)
      ).to.be.revertedWith("Address is already a beneficiary");
    });
  });

  describe("Welfare Distribution", function () {
    beforeEach(async function () {
      await welfareDistribution.connect(owner).registerMinistry(ministry.address);
      await welfareDistribution.connect(ministry).registerBeneficiary(beneficiary.address);
    });

    it("Should allow ministry to distribute welfare to beneficiary", async function () {
      const amount = ethers.utils.parseEther("100");
      await welfareDistribution.connect(ministry).distributeWelfare(beneficiary.address, amount);
      
      expect(await welfareToken.balanceOf(beneficiary.address)).to.equal(amount);
    });

    it("Should not allow non-ministry to distribute welfare", async function () {
      const amount = ethers.utils.parseEther("100");
      await expect(
        welfareDistribution.connect(other).distributeWelfare(beneficiary.address, amount)
      ).to.be.revertedWith("Caller is not a ministry");
    });

    it("Should not allow distribution to non-beneficiary", async function () {
      const amount = ethers.utils.parseEther("100");
      await expect(
        welfareDistribution.connect(ministry).distributeWelfare(other.address, amount)
      ).to.be.revertedWith("Address is not a beneficiary");
    });

    it("Should not allow distribution of zero tokens", async function () {
      await expect(
        welfareDistribution.connect(ministry).distributeWelfare(beneficiary.address, 0)
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should not allow distribution exceeding contract balance", async function () {
      const amount = ethers.utils.parseEther("2000");
      await expect(
        welfareDistribution.connect(ministry).distributeWelfare(beneficiary.address, amount)
      ).to.be.revertedWith("Insufficient contract balance");
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to withdraw tokens", async function () {
      const amount = ethers.utils.parseEther("500");
      await welfareDistribution.connect(owner).withdrawTokens(amount);
      
      expect(await welfareToken.balanceOf(owner.address)).to.equal(amount);
    });

    it("Should not allow non-owner to withdraw tokens", async function () {
      const amount = ethers.utils.parseEther("500");
      await expect(
        welfareDistribution.connect(other).withdrawTokens(amount)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow withdrawal exceeding contract balance", async function () {
      const amount = ethers.utils.parseEther("2000");
      await expect(
        welfareDistribution.connect(owner).withdrawTokens(amount)
      ).to.be.revertedWith("Insufficient contract balance");
    });
  });
}); 