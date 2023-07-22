// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import "../src/NftLoan.sol";
import "../mock/NFT.sol";

contract Deploy is Script {
    function run() public {
        vm.createFork("https://polygon.llamarpc.com");

        PositionDelegation factory = new PositionDelegation();
        NFT nft = new NFT();

        vm.broadcast();

        factory.createSafe(address(this), nft, 1, 1);
    }
}