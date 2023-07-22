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
            0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619
        );

        console.log("Factory address: %s", address(factory));
    }
}
