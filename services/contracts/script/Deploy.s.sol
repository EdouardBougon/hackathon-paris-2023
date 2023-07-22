// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import "../src/PositionDelegation.sol";

contract RandomAddress {}

contract Deploy is Script {
    function run() public {
        uint forkId = vm.createFork("https://polygon.llamarpc.com");
        vm.selectFork(forkId);

        vm.broadcast();

        PositionDelegation factory = new PositionDelegation(0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619);
        factory.getOrCreateSafe(address(new RandomAddress()));
    }
}