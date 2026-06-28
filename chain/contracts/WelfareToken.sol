// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title WelfareToken
 * @notice Programmable government welfare token (ERC-20) used inside the WelfareChain simulation.
 *         A token is minted when a benefit is authorised and burned the instant it is "converted
 *         to fiat" — so the token only ever exists transiently as the on-chain representation of
 *         an approved, in-flight benefit. Only the DisbursementController may mint/burn.
 * @dev    Simulation only. Real rupees are credited off-chain; the burn + a fiatRef event provide
 *         the immutable on-chain link.
 */
contract WelfareToken is ERC20, AccessControl {
    bytes32 public constant CONTROLLER_ROLE = keccak256("CONTROLLER_ROLE");

    constructor(address admin) ERC20("WelfareToken", "WLFR") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /// @notice Grant the disbursement controller permission to mint/burn.
    function setController(address controller) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(CONTROLLER_ROLE, controller);
    }

    function mintTo(address to, uint256 amount) external onlyRole(CONTROLLER_ROLE) {
        _mint(to, amount);
    }

    function burnFrom(address from, uint256 amount) external onlyRole(CONTROLLER_ROLE) {
        _burn(from, amount);
    }
}
