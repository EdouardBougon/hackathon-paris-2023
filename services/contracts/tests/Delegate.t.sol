// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "../lib/forge-std/src/Test.sol";
import {ERC721, ERC721Enumerable} from "../lib/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "../src/PositionDelegation.sol";
import {CustomSafe} from "../src/CustomSafe.sol";
import {MockERC721} from "./MockUniswap.sol";

contract RandomAddress {}

contract Delegate is Test {
    function testDelegate() public {
        uint forkId = vm.createFork("https://polygon.llamarpc.com");
        vm.selectFork(forkId);

        vm.broadcast();

        PositionDelegation factory = new PositionDelegation();

        address userAddress = 0x48878d24757E2f7cF9f692536a17C2870821663f;
        address kairosAddress = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;

        // Delegate
        vm.startPrank(userAddress);

        MockERC721 uniswapPosition = new MockERC721("Uniswap Position", "UP");
        uniswapPosition.mint(userAddress, 1);

        uniswapPosition.approve(address(factory), 1);

        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = 1;
        address safeAddress = factory.delegate(
            address(uniswapPosition),
            tokenIds
        );
        assertEq(uniswapPosition.balanceOf(userAddress), 0);
        assertEq(factory.balanceOf(userAddress), 2);

        CustomSafe safe = CustomSafe(payable(safeAddress));
        address[] memory owners = safe.getOwners();

        assertEq(owners.length, 2);
        assertEq(owners[0], userAddress);
        assertEq(owners[1], address(factory));

        // Transfer
        factory.transferFrom(userAddress, kairosAddress, 1);

        owners = safe.getOwners();

        assertEq(owners.length, 3);
        assertEq(owners[0], kairosAddress);
        assertEq(owners[1], userAddress);
        assertEq(owners[2], address(factory));

        // Transfer userToken to kairos
        factory.transferFrom(userAddress, kairosAddress, 2);

        owners = safe.getOwners();

        assertEq(owners.length, 2);
        assertEq(owners[0], kairosAddress);
        assertEq(owners[1], address(factory));
    }
}
