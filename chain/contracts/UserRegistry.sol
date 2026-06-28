// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title UserRegistry
 * @notice Maps a *hashed* simulated identity (e.g. keccak256 of a mock Aadhaar) to a wallet
 *         address. Privacy-by-design: only the commitment hash is stored on-chain; raw identity
 *         data lives off-chain, encrypted. No real Aadhaar numbers are ever used (simulation).
 */
contract UserRegistry is AccessControl {
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    struct Citizen {
        address wallet;
        bool registered;
        uint256 registeredAt;
    }

    mapping(bytes32 => Citizen) private _citizens; // idCommitment => Citizen

    event UserRegistered(bytes32 indexed idCommitment, address indexed wallet);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REGISTRAR_ROLE, admin);
    }

    /// @param idCommitment keccak256(mockAadhaar + salt) — never the raw number
    function register(bytes32 idCommitment, address wallet)
        external
        onlyRole(REGISTRAR_ROLE)
    {
        require(!_citizens[idCommitment].registered, "UserRegistry: already registered");
        require(wallet != address(0), "UserRegistry: zero wallet");
        _citizens[idCommitment] = Citizen(wallet, true, block.timestamp);
        emit UserRegistered(idCommitment, wallet);
    }

    function walletOf(bytes32 idCommitment) external view returns (address) {
        require(_citizens[idCommitment].registered, "UserRegistry: not registered");
        return _citizens[idCommitment].wallet;
    }

    function isRegistered(bytes32 idCommitment) external view returns (bool) {
        return _citizens[idCommitment].registered;
    }
}
