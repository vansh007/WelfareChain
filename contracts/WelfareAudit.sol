// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./WelfareToken.sol";

contract WelfareAudit is Ownable {
    WelfareToken public welfareToken;
    mapping(address => bool) public isMinistry;

    struct AuditLog {
        address ministry;
        string program;
        uint256 amount;
        uint256 date;
        string description;
    }

    AuditLog[] public auditLogs;
    mapping(address => uint256[]) public ministryAuditLogs;
    mapping(address => uint256) public ministryAuditLogCount;

    event MinistryRegistered(address indexed ministry);
    event AuditLogCreated(uint256 indexed logId, address indexed ministry);

    constructor(address _welfareToken) Ownable(msg.sender) {
        welfareToken = WelfareToken(_welfareToken);
    }

    function registerMinistry(address ministry) external onlyOwner {
        require(!isMinistry[ministry], "Address is already a ministry");
        isMinistry[ministry] = true;
        emit MinistryRegistered(ministry);
    }

    function createAuditLog(
        string memory program,
        uint256 amount,
        uint256 date,
        string memory description
    ) external {
        require(isMinistry[msg.sender], "Caller is not a ministry");
        require(amount > 0, "Amount must be greater than zero");

        uint256 logId = auditLogs.length;
        auditLogs.push(AuditLog({
            ministry: msg.sender,
            program: program,
            amount: amount,
            date: date,
            description: description
        }));

        ministryAuditLogs[msg.sender].push(logId);
        ministryAuditLogCount[msg.sender]++;

        emit AuditLogCreated(logId, msg.sender);
    }

    function getAuditLog(uint256 index) external view returns (AuditLog memory) {
        require(index < auditLogs.length, "Invalid audit log index");
        return auditLogs[index];
    }

    function getAuditLogCount() external view returns (uint256) {
        return auditLogs.length;
    }

    function getMinistryAuditLog(address ministry, uint256 index) external view returns (AuditLog memory) {
        require(index < ministryAuditLogCount[ministry], "Invalid ministry audit log index");
        return auditLogs[ministryAuditLogs[ministry][index]];
    }

    function getMinistryAuditLogCount(address ministry) external view returns (uint256) {
        return ministryAuditLogCount[ministry];
    }
} 