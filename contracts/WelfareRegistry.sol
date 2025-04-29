// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract WelfareRegistry is Ownable {
    struct BeneficiaryInfo {
        string name;
        uint256 age;
        string location;
        uint256 income;
        uint256 familySize;
        bool isActive;
    }

    struct BeneficiaryHistory {
        string program;
        uint256 amount;
        uint256 date;
    }

    mapping(address => bool) public isMinistry;
    mapping(address => bool) public isBeneficiary;
    mapping(address => BeneficiaryInfo) public beneficiaryInfo;
    mapping(address => BeneficiaryHistory[]) public beneficiaryHistory;
    mapping(address => uint256) public beneficiaryHistoryCount;

    event MinistryRegistered(address indexed ministry);
    event BeneficiaryRegistered(address indexed beneficiary);
    event BeneficiaryInfoUpdated(address indexed beneficiary);
    event BeneficiaryStatusUpdated(address indexed beneficiary, bool status);
    event BeneficiaryHistoryAdded(address indexed beneficiary);

    constructor() Ownable(msg.sender) {}

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

    function updateBeneficiaryInfo(
        address beneficiary,
        string memory name,
        uint256 age,
        string memory location,
        uint256 income,
        uint256 familySize
    ) external {
        require(isMinistry[msg.sender], "Caller is not a ministry");
        require(isBeneficiary[beneficiary], "Address is not a beneficiary");

        beneficiaryInfo[beneficiary] = BeneficiaryInfo({
            name: name,
            age: age,
            location: location,
            income: income,
            familySize: familySize,
            isActive: true
        });

        emit BeneficiaryInfoUpdated(beneficiary);
    }

    function updateBeneficiaryStatus(
        address beneficiary,
        bool status
    ) external {
        require(isMinistry[msg.sender], "Caller is not a ministry");
        require(isBeneficiary[beneficiary], "Address is not a beneficiary");

        beneficiaryInfo[beneficiary].isActive = status;
        emit BeneficiaryStatusUpdated(beneficiary, status);
    }

    function addBeneficiaryHistory(
        address beneficiary,
        string memory program,
        uint256 amount,
        uint256 date
    ) external {
        require(isMinistry[msg.sender], "Caller is not a ministry");
        require(isBeneficiary[beneficiary], "Address is not a beneficiary");

        beneficiaryHistory[beneficiary].push(
            BeneficiaryHistory({program: program, amount: amount, date: date})
        );

        beneficiaryHistoryCount[beneficiary]++;
        emit BeneficiaryHistoryAdded(beneficiary);
    }

    function getBeneficiaryHistory(
        address beneficiary,
        uint256 index
    ) external view returns (BeneficiaryHistory memory) {
        require(
            index < beneficiaryHistoryCount[beneficiary],
            "Invalid history index"
        );
        return beneficiaryHistory[beneficiary][index];
    }

    function getBeneficiaryHistoryCount(
        address beneficiary
    ) external view returns (uint256) {
        return beneficiaryHistoryCount[beneficiary];
    }
}
