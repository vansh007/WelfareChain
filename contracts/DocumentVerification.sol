// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentVerification {
    struct Document {
        bytes32 documentHash;
        address owner;
        uint256 timestamp;
        bool isVerified;
        address verifiedBy;
    }

    mapping(bytes32 => Document) public documents;
    mapping(address => bytes32[]) public userDocuments;

    event DocumentUploaded(bytes32 indexed documentId, address indexed owner);
    event DocumentVerified(bytes32 indexed documentId, address indexed verifier);
    event DocumentRejected(bytes32 indexed documentId, address indexed verifier);

    function uploadDocument(bytes32 _documentHash) external {
        require(documents[_documentHash].owner == address(0), "Document already exists");
        
        documents[_documentHash] = Document({
            documentHash: _documentHash,
            owner: msg.sender,
            timestamp: block.timestamp,
            isVerified: false,
            verifiedBy: address(0)
        });

        userDocuments[msg.sender].push(_documentHash);
        emit DocumentUploaded(_documentHash, msg.sender);
    }

    function verifyDocument(bytes32 _documentHash) external {
        require(documents[_documentHash].owner != address(0), "Document does not exist");
        require(!documents[_documentHash].isVerified, "Document already verified");
        require(documents[_documentHash].owner != msg.sender, "Cannot verify own document");

        documents[_documentHash].isVerified = true;
        documents[_documentHash].verifiedBy = msg.sender;
        emit DocumentVerified(_documentHash, msg.sender);
    }

    function rejectDocument(bytes32 _documentHash) external {
        require(documents[_documentHash].owner != address(0), "Document does not exist");
        require(!documents[_documentHash].isVerified, "Document already verified");
        require(documents[_documentHash].owner != msg.sender, "Cannot reject own document");

        emit DocumentRejected(_documentHash, msg.sender);
    }

    function getDocumentDetails(bytes32 _documentHash)
        external
        view
        returns (
            address owner,
            uint256 timestamp,
            bool isVerified,
            address verifiedBy
        )
    {
        Document storage doc = documents[_documentHash];
        return (doc.owner, doc.timestamp, doc.isVerified, doc.verifiedBy);
    }

    function getUserDocuments(address _user)
        external
        view
        returns (bytes32[] memory)
    {
        return userDocuments[_user];
    }

    function isDocumentVerified(bytes32 _documentHash)
        external
        view
        returns (bool)
    {
        return documents[_documentHash].isVerified;
    }
} 