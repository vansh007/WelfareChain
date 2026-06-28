// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title SchemeRegistry
 * @notice On-chain registry of welfare schemes for the WelfareChain simulation (UP scope).
 *         Holds the canonical amount and a hash of the off-chain eligibility rules JSON.
 *         The off-chain Eligibility Engine reads `amount`/`rulesHash` and resolves eligibility
 *         against a citizen profile; the hash lets anyone verify the rules weren't tampered.
 * @dev    Simulation artifact — not for production fund movement.
 */
contract SchemeRegistry is AccessControl {
    bytes32 public constant SCHEME_ADMIN_ROLE = keccak256("SCHEME_ADMIN_ROLE");

    struct Scheme {
        uint256 id;
        string nameEn;      // e.g. "Old Age Pension"
        string nameHi;      // e.g. "वृद्धावस्था पेंशन"
        uint256 amount;     // benefit amount (paise / smallest unit) for simulation
        bytes32 rulesHash;  // keccak256 of the off-chain eligibility rules JSON
        bool active;
    }

    uint256 public schemeCount;
    mapping(uint256 => Scheme) public schemes;

    event SchemeAdded(uint256 indexed id, string nameEn, uint256 amount, bytes32 rulesHash);
    event SchemeUpdated(uint256 indexed id, uint256 amount, bytes32 rulesHash, bool active);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(SCHEME_ADMIN_ROLE, admin);
    }

    function addScheme(
        string calldata nameEn,
        string calldata nameHi,
        uint256 amount,
        bytes32 rulesHash
    ) external onlyRole(SCHEME_ADMIN_ROLE) returns (uint256 id) {
        id = ++schemeCount;
        schemes[id] = Scheme(id, nameEn, nameHi, amount, rulesHash, true);
        emit SchemeAdded(id, nameEn, amount, rulesHash);
    }

    function updateScheme(
        uint256 id,
        uint256 amount,
        bytes32 rulesHash,
        bool active
    ) external onlyRole(SCHEME_ADMIN_ROLE) {
        require(id != 0 && id <= schemeCount, "SchemeRegistry: unknown scheme");
        Scheme storage s = schemes[id];
        s.amount = amount;
        s.rulesHash = rulesHash;
        s.active = active;
        emit SchemeUpdated(id, amount, rulesHash, active);
    }

    function getAmount(uint256 id) external view returns (uint256) {
        require(schemes[id].active, "SchemeRegistry: inactive scheme");
        return schemes[id].amount;
    }
}
