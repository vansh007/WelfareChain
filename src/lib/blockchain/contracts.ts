import { ethers } from 'ethers';

// Contract ABIs
export const SCHEME_REGISTRY_ABI = [
  "function registerMinistry(string memory _name) external",
  "function createScheme(string memory _name, string memory _description, uint256 _maxBeneficiaries) external",
  "function applyForScheme(bytes32 _schemeId) external",
  "function approveApplication(bytes32 _schemeId, address _applicant) external",
  "function rejectApplication(bytes32 _schemeId, address _applicant) external",
  "function getSchemeDetails(bytes32 _schemeId) external view returns (string memory name, string memory description, address ministry, bool isActive, uint256 maxBeneficiaries, uint256 currentBeneficiaries)",
  "function getUserApplications(address _user) external view returns (bytes32[] memory)",
  "function isBeneficiary(bytes32 _schemeId, address _user) external view returns (bool)"
];

export const DOCUMENT_VERIFICATION_ABI = [
  "function uploadDocument(bytes32 _documentHash) external",
  "function verifyDocument(bytes32 _documentHash) external",
  "function rejectDocument(bytes32 _documentHash) external",
  "function getDocumentDetails(bytes32 _documentHash) external view returns (address owner, uint256 timestamp, bool isVerified, address verifiedBy)",
  "function getUserDocuments(address _user) external view returns (bytes32[] memory)",
  "function isDocumentVerified(bytes32 _documentHash) external view returns (bool)"
];

export const ELIGIBILITY_VERIFICATION_ABI = [
  "function createProfile(uint256 _age, uint256 _income, bool _isRural, bool _isBPL, bool _isFarmer, bool _isWoman, bool _isSeniorCitizen, bool _isDisabled) external",
  "function updateProfile(uint256 _age, uint256 _income, bool _isRural, bool _isBPL, bool _isFarmer, bool _isWoman, bool _isSeniorCitizen, bool _isDisabled) external",
  "function verifyProfile(address _user) external",
  "function setSchemeCriteria(bytes32 _schemeId, uint256 _minAge, uint256 _maxAge, uint256 _minIncome, uint256 _maxIncome, bool _isRural, bool _isBPL, bool _isFarmer, bool _isWoman, bool _isSeniorCitizen, bool _isDisabled) external",
  "function checkEligibility(bytes32 _schemeId, address _user) external view returns (bool)",
  "function getProfile(address _user) external view returns (uint256 age, uint256 income, bool isRural, bool isBPL, bool isFarmer, bool isWoman, bool isSeniorCitizen, bool isDisabled, bool isVerified)"
];

// Contract addresses (update these after deployment)
export const CONTRACT_ADDRESSES = {
  schemeRegistry: process.env.NEXT_PUBLIC_SCHEME_REGISTRY_ADDRESS || '',
  documentVerification: process.env.NEXT_PUBLIC_DOCUMENT_VERIFICATION_ADDRESS || '',
  eligibilityVerification: process.env.NEXT_PUBLIC_ELIGIBILITY_VERIFICATION_ADDRESS || ''
}; 