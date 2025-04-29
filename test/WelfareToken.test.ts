import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { WelfareToken } from "../typechain-types";

describe("WelfareToken", function () {
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

    // Register ministry
    await welfareToken.connect(owner).registerMinistry(ministry.address);
  });

  describe("Contract Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await welfareToken.name()).to.equal("Welfare Token");
      expect(await welfareToken.symbol()).to.equal("WELF");
    });

    it("Should set the correct owner", async function () {
      expect(await welfareToken.owner()).to.equal(owner.address);
    });
  });

  describe("Ministry Management", function () {
    it("Should allow owner to register ministry", async function () {
      await welfareToken.connect(owner).registerMinistry(ministry.address);
      expect(await welfareToken.isMinistry(ministry.address)).to.be.true;
    });

    it("Should not allow non-owner to register ministry", async function () {
      await expect(
        welfareToken.connect(other).registerMinistry(ministry.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow duplicate ministry registration", async function () {
      await welfareToken.connect(owner).registerMinistry(ministry.address);
      await expect(
        welfareToken.connect(owner).registerMinistry(ministry.address)
      ).to.be.revertedWith("Address is already a ministry");
    });
  });

  describe("Beneficiary Management", function () {
    beforeEach(async function () {
      await welfareToken.connect(owner).registerMinistry(ministry.address);
    });

    it("Should allow ministry to register beneficiary", async function () {
      await welfareToken.connect(ministry).registerBeneficiary(beneficiary.address);
      expect(await welfareToken.isBeneficiary(beneficiary.address)).to.be.true;
    });

    it("Should not allow non-ministry to register beneficiary", async function () {
      await expect(
        welfareToken.connect(other).registerBeneficiary(beneficiary.address)
      ).to.be.revertedWith("Caller is not a ministry");
    });

    it("Should not allow duplicate beneficiary registration", async function () {
      await welfareToken.connect(ministry).registerBeneficiary(beneficiary.address);
      await expect(
        welfareToken.connect(ministry).registerBeneficiary(beneficiary.address)
      ).to.be.revertedWith("Address is already a beneficiary");
    });
  });

  describe("Token Distribution", function () {
    beforeEach(async function () {
      await welfareToken.connect(owner).registerMinistry(ministry.address);
      await welfareToken.connect(ministry).registerBeneficiary(beneficiary.address);
    });

    it("Should allow ministry to distribute tokens to beneficiary", async function () {
      const amount = ethers.utils.parseEther("100");
      await welfareToken.connect(ministry).distributeTokens(beneficiary.address, amount);
      expect(await welfareToken.balanceOf(beneficiary.address)).to.equal(amount);
    });

    it("Should not allow non-ministry to distribute tokens", async function () {
      const amount = ethers.utils.parseEther("100");
      await expect(
        welfareToken.connect(other).distributeTokens(beneficiary.address, amount)
      ).to.be.revertedWith("Caller is not a ministry");
    });

    it("Should not allow distribution to non-beneficiary", async function () {
      const amount = ethers.utils.parseEther("100");
      await expect(
        welfareToken.connect(ministry).distributeTokens(other.address, amount)
      ).to.be.revertedWith("Recipient is not a beneficiary");
    });

    it("Should not allow distribution of zero tokens", async function () {
      await expect(
        welfareToken.connect(ministry).distributeTokens(beneficiary.address, 0)
      ).to.be.revertedWith("Amount must be greater than zero");
    });
  });

  describe("Token Transfers", function () {
    beforeEach(async function () {
      await welfareToken.connect(owner).registerMinistry(ministry.address);
      await welfareToken.connect(ministry).registerBeneficiary(beneficiary.address);
      await welfareToken.connect(ministry).distributeTokens(beneficiary.address, ethers.utils.parseEther("100"));
    });

    it("Should allow beneficiary to transfer tokens", async function () {
      const amount = ethers.utils.parseEther("50");
      await welfareToken.connect(beneficiary).transfer(other.address, amount);
      expect(await welfareToken.balanceOf(other.address)).to.equal(amount);
    });

    it("Should not allow transfer of more tokens than balance", async function () {
      const amount = ethers.utils.parseEther("150");
      await expect(
        welfareToken.connect(beneficiary).transfer(other.address, amount)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to withdraw tokens", async function () {
      const amount = ethers.utils.parseEther("100");
      await welfareToken.connect(owner).mint(owner.address, amount);
      await welfareToken.connect(owner).withdrawTokens(amount);
      expect(await welfareToken.balanceOf(owner.address)).to.equal(0);
    });

    it("Should not allow non-owner to withdraw tokens", async function () {
      const amount = ethers.utils.parseEther("100");
      await welfareToken.connect(owner).mint(owner.address, amount);
      await expect(
        welfareToken.connect(other).withdrawTokens(amount)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow withdrawal of more tokens than balance", async function () {
      const amount = ethers.utils.parseEther("100");
      await expect(
        welfareToken.connect(owner).withdrawTokens(amount)
      ).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });
  });
}); 