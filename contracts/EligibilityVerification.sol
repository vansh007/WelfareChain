// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EligibilityVerification {
    struct EligibilityCriteria {
        uint256 minAge;
        uint256 maxAge;
        uint256 minIncome;
        uint256 maxIncome;
        bool isRural;
        bool isBPL;
        bool isFarmer;
        bool isWoman;
        bool isSeniorCitizen;
        bool isDisabled;
    }

    struct UserProfile {
        uint256 age;
        uint256 income;
        bool isRural;
        bool isBPL;
        bool isFarmer;
        bool isWoman;
        bool isSeniorCitizen;
        bool isDisabled;
        bool isVerified;
    }

    mapping(address => UserProfile) public userProfiles;
    mapping(bytes32 => EligibilityCriteria) public schemeCriteria;

    event ProfileCreated(address indexed user);
    event ProfileUpdated(address indexed user);
    event ProfileVerified(address indexed user, address indexed verifier);
    event CriteriaSet(bytes32 indexed schemeId);

    function createProfile(
        uint256 _age,
        uint256 _income,
        bool _isRural,
        bool _isBPL,
        bool _isFarmer,
        bool _isWoman,
        bool _isSeniorCitizen,
        bool _isDisabled
    ) external {
        require(userProfiles[msg.sender].age == 0, "Profile already exists");
        
        userProfiles[msg.sender] = UserProfile({
            age: _age,
            income: _income,
            isRural: _isRural,
            isBPL: _isBPL,
            isFarmer: _isFarmer,
            isWoman: _isWoman,
            isSeniorCitizen: _isSeniorCitizen,
            isDisabled: _isDisabled,
            isVerified: false
        });

        emit ProfileCreated(msg.sender);
    }

    function updateProfile(
        uint256 _age,
        uint256 _income,
        bool _isRural,
        bool _isBPL,
        bool _isFarmer,
        bool _isWoman,
        bool _isSeniorCitizen,
        bool _isDisabled
    ) external {
        require(userProfiles[msg.sender].age != 0, "Profile does not exist");
        
        userProfiles[msg.sender] = UserProfile({
            age: _age,
            income: _income,
            isRural: _isRural,
            isBPL: _isBPL,
            isFarmer: _isFarmer,
            isWoman: _isWoman,
            isSeniorCitizen: _isSeniorCitizen,
            isDisabled: _isDisabled,
            isVerified: false
        });

        emit ProfileUpdated(msg.sender);
    }

    function verifyProfile(address _user) external {
        require(userProfiles[_user].age != 0, "Profile does not exist");
        require(!userProfiles[_user].isVerified, "Profile already verified");
        
        userProfiles[_user].isVerified = true;
        emit ProfileVerified(_user, msg.sender);
    }

    function setSchemeCriteria(
        bytes32 _schemeId,
        uint256 _minAge,
        uint256 _maxAge,
        uint256 _minIncome,
        uint256 _maxIncome,
        bool _isRural,
        bool _isBPL,
        bool _isFarmer,
        bool _isWoman,
        bool _isSeniorCitizen,
        bool _isDisabled
    ) external {
        schemeCriteria[_schemeId] = EligibilityCriteria({
            minAge: _minAge,
            maxAge: _maxAge,
            minIncome: _minIncome,
            maxIncome: _maxIncome,
            isRural: _isRural,
            isBPL: _isBPL,
            isFarmer: _isFarmer,
            isWoman: _isWoman,
            isSeniorCitizen: _isSeniorCitizen,
            isDisabled: _isDisabled
        });

        emit CriteriaSet(_schemeId);
    }

    function checkEligibility(bytes32 _schemeId, address _user)
        external
        view
        returns (bool)
    {
        require(userProfiles[_user].age != 0, "Profile does not exist");
        require(userProfiles[_user].isVerified, "Profile not verified");

        UserProfile memory profile = userProfiles[_user];
        EligibilityCriteria memory criteria = schemeCriteria[_schemeId];

        if (profile.age < criteria.minAge || profile.age > criteria.maxAge) return false;
        if (profile.income < criteria.minIncome || profile.income > criteria.maxIncome) return false;
        if (criteria.isRural && !profile.isRural) return false;
        if (criteria.isBPL && !profile.isBPL) return false;
        if (criteria.isFarmer && !profile.isFarmer) return false;
        if (criteria.isWoman && !profile.isWoman) return false;
        if (criteria.isSeniorCitizen && !profile.isSeniorCitizen) return false;
        if (criteria.isDisabled && !profile.isDisabled) return false;

        return true;
    }

    function getProfile(address _user)
        external
        view
        returns (
            uint256 age,
            uint256 income,
            bool isRural,
            bool isBPL,
            bool isFarmer,
            bool isWoman,
            bool isSeniorCitizen,
            bool isDisabled,
            bool isVerified
        )
    {
        UserProfile memory profile = userProfiles[_user];
        return (
            profile.age,
            profile.income,
            profile.isRural,
            profile.isBPL,
            profile.isFarmer,
            profile.isWoman,
            profile.isSeniorCitizen,
            profile.isDisabled,
            profile.isVerified
        );
    }
} 