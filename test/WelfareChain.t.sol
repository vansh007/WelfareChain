// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/WelfareChain.sol";

contract WelfareChainTest is Test {
    WelfareChain public welfareChain;
    address public beneficiary = address(0x1);
    address public admin = address(0x2);

    function setUp() public {
        welfareChain = new WelfareChain();
        vm.startPrank(admin);
        welfareChain.grantRole(welfareChain.ADMIN_ROLE(), admin);
        vm.stopPrank();
    }

    function test_AddBeneficiary() public {
        vm.startPrank(admin);
        welfareChain.addBeneficiary(beneficiary, "John Doe", "1234567890");
        (string memory name, string memory id, bool isActive) = welfareChain
            .getBeneficiary(beneficiary);
        assertEq(name, "John Doe");
        assertEq(id, "1234567890");
        assertTrue(isActive);
        vm.stopPrank();
    }

    function test_OnlyAdminCanAddBeneficiary() public {
        vm.startPrank(beneficiary);
        vm.expectRevert();
        welfareChain.addBeneficiary(beneficiary, "John Doe", "1234567890");
        vm.stopPrank();
    }

    function test_AddScheme() public {
        vm.startPrank(admin);
        welfareChain.addScheme(
            "Food Security",
            "Provides food assistance to eligible beneficiaries",
            1000 ether,
            100
        );
        (
            string memory name,
            string memory description,
            uint256 budget,
            uint256 maxBeneficiaries,
            bool isActive
        ) = welfareChain.getScheme(1);
        assertEq(name, "Food Security");
        assertEq(
            description,
            "Provides food assistance to eligible beneficiaries"
        );
        assertEq(budget, 1000 ether);
        assertEq(maxBeneficiaries, 100);
        assertTrue(isActive);
        vm.stopPrank();
    }

    function test_ApplyForScheme() public {
        // Setup: Add beneficiary and scheme
        vm.startPrank(admin);
        welfareChain.addBeneficiary(beneficiary, "John Doe", "1234567890");
        welfareChain.addScheme(
            "Food Security",
            "Provides food assistance to eligible beneficiaries",
            1000 ether,
            100
        );
        vm.stopPrank();

        // Apply for scheme
        vm.startPrank(beneficiary);
        welfareChain.applyForScheme(1);
        assertTrue(welfareChain.hasApplied(beneficiary, 1));
        vm.stopPrank();
    }

    function test_ApproveApplication() public {
        // Setup: Add beneficiary and scheme, and apply
        vm.startPrank(admin);
        welfareChain.addBeneficiary(beneficiary, "John Doe", "1234567890");
        welfareChain.addScheme(
            "Food Security",
            "Provides food assistance to eligible beneficiaries",
            1000 ether,
            100
        );
        vm.stopPrank();

        vm.startPrank(beneficiary);
        welfareChain.applyForScheme(1);
        vm.stopPrank();

        // Approve application
        vm.startPrank(admin);
        welfareChain.approveApplication(beneficiary, 1);
        assertTrue(welfareChain.isApproved(beneficiary, 1));
        vm.stopPrank();
    }

    function testFail_NonBeneficiaryCannotApply() public {
        vm.startPrank(address(0x3)); // Random address
        welfareChain.applyForScheme(1);
    }

    function testFail_NonAdminCannotApprove() public {
        vm.startPrank(beneficiary);
        welfareChain.approveApplication(beneficiary, 1);
    }
}
