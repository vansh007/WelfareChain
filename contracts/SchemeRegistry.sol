// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SchemeRegistry {
    struct Scheme {
        string name;
        string description;
        address ministry;
        bool isActive;
        uint256 maxBeneficiaries;
        uint256 currentBeneficiaries;
        mapping(address => bool) beneficiaries;
    }

    struct Ministry {
        string name;
        address ministryAddress;
        bool isActive;
    }

    mapping(bytes32 => Scheme) public schemes;
    mapping(address => Ministry) public ministries;
    mapping(address => bytes32[]) public userApplications;

    event SchemeCreated(bytes32 indexed schemeId, string name, address ministry);
    event MinistryRegistered(address indexed ministryAddress, string name);
    event ApplicationSubmitted(bytes32 indexed schemeId, address indexed applicant);
    event ApplicationApproved(bytes32 indexed schemeId, address indexed applicant);
    event ApplicationRejected(bytes32 indexed schemeId, address indexed applicant);

    modifier onlyMinistry() {
        require(ministries[msg.sender].isActive, "Not a registered ministry");
        _;
    }

    function registerMinistry(string memory _name) external {
        require(!ministries[msg.sender].isActive, "Ministry already registered");
        ministries[msg.sender] = Ministry({
            name: _name,
            ministryAddress: msg.sender,
            isActive: true
        });
        emit MinistryRegistered(msg.sender, _name);
    }

    function createScheme(
        string memory _name,
        string memory _description,
        uint256 _maxBeneficiaries
    ) external onlyMinistry {
        bytes32 schemeId = keccak256(abi.encodePacked(_name, block.timestamp));
        schemes[schemeId].name = _name;
        schemes[schemeId].description = _description;
        schemes[schemeId].ministry = msg.sender;
        schemes[schemeId].isActive = true;
        schemes[schemeId].maxBeneficiaries = _maxBeneficiaries;
        schemes[schemeId].currentBeneficiaries = 0;

        emit SchemeCreated(schemeId, _name, msg.sender);
    }

    function applyForScheme(bytes32 _schemeId) external {
        require(schemes[_schemeId].isActive, "Scheme is not active");
        require(!schemes[_schemeId].beneficiaries[msg.sender], "Already applied");
        require(
            schemes[_schemeId].currentBeneficiaries < schemes[_schemeId].maxBeneficiaries,
            "Scheme is full"
        );

        userApplications[msg.sender].push(_schemeId);
        emit ApplicationSubmitted(_schemeId, msg.sender);
    }

    function approveApplication(bytes32 _schemeId, address _applicant) external onlyMinistry {
        require(schemes[_schemeId].ministry == msg.sender, "Not the scheme ministry");
        require(!schemes[_schemeId].beneficiaries[_applicant], "Already approved");
        require(
            schemes[_schemeId].currentBeneficiaries < schemes[_schemeId].maxBeneficiaries,
            "Scheme is full"
        );

        schemes[_schemeId].beneficiaries[_applicant] = true;
        schemes[_schemeId].currentBeneficiaries++;
        emit ApplicationApproved(_schemeId, _applicant);
    }

    function rejectApplication(bytes32 _schemeId, address _applicant) external onlyMinistry {
        require(schemes[_schemeId].ministry == msg.sender, "Not the scheme ministry");
        emit ApplicationRejected(_schemeId, _applicant);
    }

    function getSchemeDetails(bytes32 _schemeId)
        external
        view
        returns (
            string memory name,
            string memory description,
            address ministry,
            bool isActive,
            uint256 maxBeneficiaries,
            uint256 currentBeneficiaries
        )
    {
        Scheme storage scheme = schemes[_schemeId];
        return (
            scheme.name,
            scheme.description,
            scheme.ministry,
            scheme.isActive,
            scheme.maxBeneficiaries,
            scheme.currentBeneficiaries
        );
    }

    function getUserApplications(address _user)
        external
        view
        returns (bytes32[] memory)
    {
        return userApplications[_user];
    }

    function isBeneficiary(bytes32 _schemeId, address _user)
        external
        view
        returns (bool)
    {
        return schemes[_schemeId].beneficiaries[_user];
    }
} 