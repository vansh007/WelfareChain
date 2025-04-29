// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WelfareToken is ERC20, Ownable {
    mapping(address => bool) public isMinistry;
    mapping(address => bool) public isBeneficiary;

    event MinistryRegistered(address indexed ministry);
    event BeneficiaryRegistered(address indexed beneficiary);
    event TokensDistributed(address indexed beneficiary, uint256 amount);

    constructor() ERC20("Welfare Token", "WELF") Ownable(msg.sender) {}

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

    function distributeTokens(address beneficiary, uint256 amount) external {
        require(isMinistry[msg.sender], "Caller is not a ministry");
        require(isBeneficiary[beneficiary], "Recipient is not a beneficiary");
        require(amount > 0, "Amount must be greater than zero");
        
        _mint(beneficiary, amount);
        emit TokensDistributed(beneficiary, amount);
    }

    function withdrawTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero");
        _burn(msg.sender, amount);
    }
} 