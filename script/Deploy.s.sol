// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/WelfareChain.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy WelfareChain contract
        WelfareChain welfareChain = new WelfareChain();
        console.log("WelfareChain deployed to:", address(welfareChain));

        vm.stopBroadcast();
    }
}
