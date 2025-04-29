// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./WelfareToken.sol";

contract WelfareVerification is Ownable {
    WelfareToken public welfareToken;
    mapping(address => bool) public isMinistry;
    mapping(address => bool) public isBeneficiary;
    mapping(address => bool) public isVerified;
    mapping(address => bytes32) public verificationHash;

    event MinistryRegistered(address indexed ministry);
    event BeneficiaryRegistered(address indexed beneficiary);
    event DocumentsVerified(address indexed beneficiary, bytes32 documentHash);

    constructor(address _welfareToken) Ownable(msg.sender) {
        welfareToken = WelfareToken(_welfareToken);
    }

    function registerMinistry(address ministry) external onlyOwner {
        require(!isMinistry[ministry], "Address is already a ministry");
        isMinistry[ministry] = true;
        emit MinistryRegistered(ministry);
    }

    function registerBeneficiary(address beneficiary) external {
        require(isMinistry[msg.sender], "Caller is not a ministry");
        require(!isBeneficiary[beneficiary], "Address is already a beneficiary");
        isBeneficiary[beneficiary] = true;
        emit BeneficiaryRegistered(beneficiary);
    }

    function verifyDocuments(address beneficiary, bytes32 documentHash) external {
        require(isMinistry[msg.sender], "Caller is not a ministry");
        require(isBeneficiary[beneficiary], "Address is not a beneficiary");
        require(documentHash != bytes32(0), "Document hash cannot be empty");
        
        isVerified[beneficiary] = true;
        verificationHash[beneficiary] = documentHash;
        emit DocumentsVerified(beneficiary, documentHash);
    }

    function getVerificationHash(address beneficiary) external view returns (bytes32) {
        return verificationHash[beneficiary];
    }
} 