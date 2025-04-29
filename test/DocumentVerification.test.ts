import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { DocumentVerification } from "../typechain-types";

describe("DocumentVerification", function () {
  let documentVerification: DocumentVerification;
  let owner: SignerWithAddress;
  let verifier: SignerWithAddress;
  let user: SignerWithAddress;

  beforeEach(async function () {
    [owner, verifier, user] = await ethers.getSigners();
    const DocumentVerification = await ethers.getContractFactory("DocumentVerification");
    documentVerification = await DocumentVerification.deploy();
    await documentVerification.deployed();
  });

  describe("Document Upload", function () {
    it("Should allow user to upload document", async function () {
      const documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test document"));
      await documentVerification.connect(user).uploadDocument(documentHash);
      
      const document = await documentVerification.getDocumentDetails(documentHash);
      expect(document.owner).to.equal(user.address);
      expect(document.isVerified).to.be.false;
    });

    it("Should not allow duplicate document upload", async function () {
      const documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test document"));
      await documentVerification.connect(user).uploadDocument(documentHash);
      
      await expect(
        documentVerification.connect(user).uploadDocument(documentHash)
      ).to.be.revertedWith("Document already exists");
    });
  });

  describe("Document Verification", function () {
    let documentHash: string;

    beforeEach(async function () {
      documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test document"));
      await documentVerification.connect(user).uploadDocument(documentHash);
    });

    it("Should allow verifier to verify document", async function () {
      await documentVerification.connect(verifier).verifyDocument(documentHash);
      
      const document = await documentVerification.getDocumentDetails(documentHash);
      expect(document.isVerified).to.be.true;
      expect(document.verifiedBy).to.equal(verifier.address);
    });

    it("Should allow verifier to reject document", async function () {
      await documentVerification.connect(verifier).rejectDocument(documentHash);
      
      const document = await documentVerification.getDocumentDetails(documentHash);
      expect(document.isVerified).to.be.false;
    });

    it("Should not allow verification of non-existent document", async function () {
      const nonExistentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("non-existent"));
      await expect(
        documentVerification.connect(verifier).verifyDocument(nonExistentHash)
      ).to.be.revertedWith("Document does not exist");
    });
  });

  describe("Document Queries", function () {
    let documentHash: string;

    beforeEach(async function () {
      documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test document"));
      await documentVerification.connect(user).uploadDocument(documentHash);
    });

    it("Should return correct document details", async function () {
      const document = await documentVerification.getDocumentDetails(documentHash);
      expect(document.owner).to.equal(user.address);
      expect(document.isVerified).to.be.false;
    });

    it("Should return user's documents", async function () {
      const userDocuments = await documentVerification.getUserDocuments(user.address);
      expect(userDocuments).to.include(documentHash);
    });

    it("Should correctly check document verification status", async function () {
      let isVerified = await documentVerification.isDocumentVerified(documentHash);
      expect(isVerified).to.be.false;

      await documentVerification.connect(verifier).verifyDocument(documentHash);
      isVerified = await documentVerification.isDocumentVerified(documentHash);
      expect(isVerified).to.be.true;
    });
  });
}); 