import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { WelfareRegistry } from "../typechain-types";

describe("WelfareRegistry", function () {
  let welfareRegistry: WelfareRegistry;
  let owner: SignerWithAddress;
  let ministry: SignerWithAddress;
  let beneficiary: SignerWithAddress;
  let other: SignerWithAddress;

  beforeEach(async function () {
    [owner, ministry, beneficiary, other] = await ethers.getSigners();
    
    // Deploy WelfareRegistry
    const WelfareRegistry = await ethers.getContractFactory("WelfareRegistry");
    welfareRegistry = await WelfareRegistry.deploy();
    await welfareRegistry.deployed();

    // Register ministry
    await welfareRegistry.connect(owner).registerMinistry(ministry.address);
  });

  describe("Contract Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await welfareRegistry.owner()).to.equal(owner.address);
    });
  });

  describe("Ministry Management", function () {
    it("Should allow owner to register ministry", async function () {
      await welfareRegistry.connect(owner).registerMinistry(ministry.address);
      expect(await welfareRegistry.isMinistry(ministry.address)).to.be.true;
    });

    it("Should not allow non-owner to register ministry", async function () {
      await expect(
        welfareRegistry.connect(other).registerMinistry(ministry.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow duplicate ministry registration", async function () {
      await welfareRegistry.connect(owner).registerMinistry(ministry.address);
      await expect(
        welfareRegistry.connect(owner).registerMinistry(ministry.address)
      ).to.be.revertedWith("Address is already a ministry");
    });
  });

  describe("Beneficiary Management", function () {
    beforeEach(async function () {
      await welfareRegistry.connect(owner).registerMinistry(ministry.address);
    });

    it("Should allow ministry to register beneficiary", async function () {
      await welfareRegistry.connect(ministry).registerBeneficiary(beneficiary.address);
      expect(await welfareRegistry.isBeneficiary(beneficiary.address)).to.be.true;
    });

    it("Should not allow non-ministry to register beneficiary", async function () {
      await expect(
        welfareRegistry.connect(other).registerBeneficiary(beneficiary.address)
      ).to.be.revertedWith("Caller is not a ministry");
    });

    it("Should not allow duplicate beneficiary registration", async function () {
      await welfareRegistry.connect(ministry).registerBeneficiary(beneficiary.address);
      await expect(
        welfareRegistry.connect(ministry).registerBeneficiary(beneficiary.address)
      ).to.be.revertedWith("Address is already a beneficiary");
    });
  });

  describe("Beneficiary Information", function () {
    beforeEach(async function () {
      await welfareRegistry.connect(owner).registerMinistry(ministry.address);
      await welfareRegistry.connect(ministry).registerBeneficiary(beneficiary.address);
    });

    it("Should allow ministry to update beneficiary information", async function () {
      const name = "John Doe";
      const age = 30;
      const location = "New York";
      const income = ethers.utils.parseEther("1000");
      const familySize = 4;

      await welfareRegistry.connect(ministry).updateBeneficiaryInfo(
        beneficiary.address,
        name,
        age,
        location,
        income,
        familySize
      );

      const info = await welfareRegistry.getBeneficiaryInfo(beneficiary.address);
      expect(info.name).to.equal(name);
      expect(info.age).to.equal(age);
      expect(info.location).to.equal(location);
      expect(info.income).to.equal(income);
      expect(info.familySize).to.equal(familySize);
    });

    it("Should not allow non-ministry to update beneficiary information", async function () {
      await expect(
        welfareRegistry.connect(other).updateBeneficiaryInfo(
          beneficiary.address,
          "John Doe",
          30,
          "New York",
          ethers.utils.parseEther("1000"),
          4
        )
      ).to.be.revertedWith("Caller is not a ministry");
    });

    it("Should not allow updating information for non-beneficiary", async function () {
      await expect(
        welfareRegistry.connect(ministry).updateBeneficiaryInfo(
          other.address,
          "John Doe",
          30,
          "New York",
          ethers.utils.parseEther("1000"),
          4
        )
      ).to.be.revertedWith("Address is not a beneficiary");
    });
  });

  describe("Beneficiary Status", function () {
    beforeEach(async function () {
      await welfareRegistry.connect(owner).registerMinistry(ministry.address);
      await welfareRegistry.connect(ministry).registerBeneficiary(beneficiary.address);
    });

    it("Should allow ministry to update beneficiary status", async function () {
      await welfareRegistry.connect(ministry).updateBeneficiaryStatus(beneficiary.address, true);
      expect(await welfareRegistry.isBeneficiaryActive(beneficiary.address)).to.be.true;

      await welfareRegistry.connect(ministry).updateBeneficiaryStatus(beneficiary.address, false);
      expect(await welfareRegistry.isBeneficiaryActive(beneficiary.address)).to.be.false;
    });

    it("Should not allow non-ministry to update beneficiary status", async function () {
      await expect(
        welfareRegistry.connect(other).updateBeneficiaryStatus(beneficiary.address, true)
      ).to.be.revertedWith("Caller is not a ministry");
    });

    it("Should not allow updating status for non-beneficiary", async function () {
      await expect(
        welfareRegistry.connect(ministry).updateBeneficiaryStatus(other.address, true)
      ).to.be.revertedWith("Address is not a beneficiary");
    });
  });

  describe("Beneficiary History", function () {
    beforeEach(async function () {
      await welfareRegistry.connect(owner).registerMinistry(ministry.address);
      await welfareRegistry.connect(ministry).registerBeneficiary(beneficiary.address);
    });

    it("Should allow ministry to add beneficiary history", async function () {
      const program = "Food Assistance";
      const amount = ethers.utils.parseEther("500");
      const date = Math.floor(Date.now() / 1000);

      await welfareRegistry.connect(ministry).addBeneficiaryHistory(
        beneficiary.address,
        program,
        amount,
        date
      );

      const history = await welfareRegistry.getBeneficiaryHistory(beneficiary.address, 0);
      expect(history.program).to.equal(program);
      expect(history.amount).to.equal(amount);
      expect(history.date).to.equal(date);
    });

    it("Should not allow non-ministry to add beneficiary history", async function () {
      await expect(
        welfareRegistry.connect(other).addBeneficiaryHistory(
          beneficiary.address,
          "Food Assistance",
          ethers.utils.parseEther("500"),
          Math.floor(Date.now() / 1000)
        )
      ).to.be.revertedWith("Caller is not a ministry");
    });

    it("Should not allow adding history for non-beneficiary", async function () {
      await expect(
        welfareRegistry.connect(ministry).addBeneficiaryHistory(
          other.address,
          "Food Assistance",
          ethers.utils.parseEther("500"),
          Math.floor(Date.now() / 1000)
        )
      ).to.be.revertedWith("Address is not a beneficiary");
    });

    it("Should return correct history count", async function () {
      await welfareRegistry.connect(ministry).addBeneficiaryHistory(
        beneficiary.address,
        "Food Assistance",
        ethers.utils.parseEther("500"),
        Math.floor(Date.now() / 1000)
      );

      expect(await welfareRegistry.getBeneficiaryHistoryCount(beneficiary.address)).to.equal(1);
    });
  });
}); 