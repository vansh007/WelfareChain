// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./WelfareToken.sol";
import "./SchemeRegistry.sol";

/**
 * @title DisbursementController
 * @notice The orchestration brain of WelfareChain. Encodes the smart-contract workflow:
 *         record a verified application -> approve & authorise -> disburse (mint token, burn as
 *         "converted to fiat", emit Disbursed with a fiatRef). A flagged application is routed to
 *         human review instead of disbursement (ethical-AI fallback, SRS FR-4.6).
 *
 *         Every state change emits an event; that event stream IS the immutable transparency
 *         ledger surfaced in the UI (SRS NFR-3, FR-9.1).
 *
 * @dev    Simulation artifact. Roles model real institutional separation of duties:
 *         APPROVER_ROLE = welfare/verification authority, TREASURY_ROLE = disbursing authority.
 */
contract DisbursementController is AccessControl, ReentrancyGuard {
    bytes32 public constant APPROVER_ROLE = keccak256("APPROVER_ROLE");
    bytes32 public constant TREASURY_ROLE = keccak256("TREASURY_ROLE");

    enum Status { None, Recorded, Approved, Disbursed, FlaggedForReview, Rejected }

    struct Disbursement {
        bytes32 appId;
        address citizen;
        uint256 schemeId;
        uint256 amount;
        Status status;
        uint16 confidenceBps; // verification confidence in basis points (0-10000)
    }

    WelfareToken public immutable token;
    SchemeRegistry public immutable schemes;

    mapping(bytes32 => Disbursement) public disbursements; // appId => record

    event ApplicationRecorded(bytes32 indexed appId, address indexed citizen, uint256 indexed schemeId, uint16 confidenceBps);
    event ApplicationApproved(bytes32 indexed appId, uint256 amount);
    event TokenMinted(bytes32 indexed appId, address indexed citizen, uint256 amount);
    event TokenConverted(bytes32 indexed appId, uint256 amount); // burned => fiat conversion
    event Disbursed(bytes32 indexed appId, address indexed citizen, uint256 amount, bytes32 fiatRef);
    event FlaggedForReview(bytes32 indexed appId, string reason);
    event Rejected(bytes32 indexed appId, string reason);

    constructor(address admin, WelfareToken _token, SchemeRegistry _schemes) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(APPROVER_ROLE, admin);
        _grantRole(TREASURY_ROLE, admin);
        token = _token;
        schemes = _schemes;
    }

    /// @notice Record the outcome of the AI verification pipeline for an application.
    function recordVerifiedApplication(
        bytes32 appId,
        address citizen,
        uint256 schemeId,
        uint16 confidenceBps,
        bool passed,
        string calldata reason
    ) external onlyRole(APPROVER_ROLE) {
        require(disbursements[appId].status == Status.None, "Controller: app exists");
        require(confidenceBps <= 10000, "Controller: bad confidence");
        uint256 amount = schemes.getAmount(schemeId);

        disbursements[appId] = Disbursement({
            appId: appId,
            citizen: citizen,
            schemeId: schemeId,
            amount: amount,
            status: passed ? Status.Recorded : Status.FlaggedForReview,
            confidenceBps: confidenceBps
        });

        emit ApplicationRecorded(appId, citizen, schemeId, confidenceBps);
        if (!passed) {
            emit FlaggedForReview(appId, reason); // human-review fallback (FR-4.6)
        }
    }

    /// @notice Approve a verified application (separation of duties from disbursement).
    function approveAndAuthorize(bytes32 appId) external onlyRole(APPROVER_ROLE) {
        Disbursement storage d = disbursements[appId];
        require(d.status == Status.Recorded, "Controller: not approvable");
        d.status = Status.Approved;
        emit ApplicationApproved(appId, d.amount);
    }

    /// @notice Disburse: mint the welfare token, immediately convert (burn) it to fiat,
    ///         emit the immutable disbursement record. Treasury authority only.
    function disburse(bytes32 appId) external onlyRole(TREASURY_ROLE) nonReentrant {
        Disbursement storage d = disbursements[appId];
        require(d.status == Status.Approved, "Controller: not approved");

        // 1) mint programmable token to citizen
        token.mintTo(d.citizen, d.amount);
        emit TokenMinted(appId, d.citizen, d.amount);

        // 2) convert to fiat == burn token (real ₹ credited off-chain against fiatRef)
        token.burnFrom(d.citizen, d.amount);
        emit TokenConverted(appId, d.amount);

        // 3) immutable disbursement record with an off-chain fiat reference
        bytes32 fiatRef = keccak256(abi.encodePacked(appId, d.citizen, d.amount, block.timestamp));
        d.status = Status.Disbursed;
        emit Disbursed(appId, d.citizen, d.amount, fiatRef);
    }

    /// @notice Resolve a flagged application after human review.
    function resolveReview(bytes32 appId, bool approve, string calldata reason)
        external
        onlyRole(APPROVER_ROLE)
    {
        Disbursement storage d = disbursements[appId];
        require(d.status == Status.FlaggedForReview, "Controller: not in review");
        if (approve) {
            d.status = Status.Recorded; // re-enters the normal approve->disburse path
            emit ApplicationRecorded(appId, d.citizen, d.schemeId, d.confidenceBps);
        } else {
            d.status = Status.Rejected;
            emit Rejected(appId, reason);
        }
    }
}
