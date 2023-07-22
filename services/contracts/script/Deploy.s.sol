// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "../lib/forge-std/src/Script.sol";

import "../src/PositionDelegation.sol";
import {console} from "../lib/forge-std/src/console.sol";

contract Deploy is Script {
    function run() public {
        uint forkId = vm.createFork("https://polygon.llamarpc.com");
        vm.selectFork(forkId);

        vm.startBroadcast();

        PositionDelegation factory = new PositionDelegation(
            0xC36442b4a4522E871399CD717aBDD847Ab11FE88 // https://docs.uniswap.org/contracts/v3/reference/deployments
        );

        console.log("Factory address: %s", address(factory));
    }
}
