// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./WelfareToken.sol";

contract WelfareDistribution is Ownable {
    WelfareToken public welfareToken;
    mapping(address => bool) public isMinistry;
    mapping(address => bool) public isBeneficiary;

    event MinistryRegistered(address indexed ministry);
    event BeneficiaryRegistered(address indexed beneficiary);
    event WelfareDistributed(address indexed beneficiary, uint256 amount);

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
        require(
            !isBeneficiary[beneficiary],
            "Address is already a beneficiary"
        );
        isBeneficiary[beneficiary] = true;
        emit BeneficiaryRegistered(beneficiary);
    }

    function distributeWelfare(address beneficiary, uint256 amount) external {
        require(isMinistry[msg.sender], "Caller is not a ministry");
        require(isBeneficiary[beneficiary], "Address is not a beneficiary");
        require(amount > 0, "Amount must be greater than 0");
        require(
            welfareToken.balanceOf(address(this)) >= amount,
            "Insufficient contract balance"
        );

        welfareToken.transfer(beneficiary, amount);
        emit WelfareDistributed(beneficiary, amount);
    }

    function withdrawTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(
            welfareToken.balanceOf(address(this)) >= amount,
            "Insufficient contract balance"
        );

        welfareToken.transfer(owner(), amount);
    }
}
