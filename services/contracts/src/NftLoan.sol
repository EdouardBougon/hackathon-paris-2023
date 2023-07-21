// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../lib/safe/contracts/proxies/SafeProxyFactory.sol";
import "../lib/safe/contracts/Safe.sol";
import "./Guard.sol";

contract PositionDelegation {
    mapping(address => address) public userToSafe;

    /**
    Delegate position:
    1. Create Safe
    2. Mint Nft for positon owner address and PositionDelegation address
    3. Register NFTs to guard for the specific position NFT
    4. Transfer position NFT to Safe
    */

    function getOrCreateSafe(
        address userAddress,
        address nftContractAddress,
        uint256 ownerTokenId,
        uint256 userTokenId
    ) public returns (address safeAddress) {
        address safe = userToSafe[userAddress];
        if (safe == address(0)) {
            safe = createSafe(
                userAddress,
                nftContractAddress,
                ownerTokenId,
                userTokenId
            );
            userToSafe[userAddress] = safe;
        }
        return safe;
    }

    function createSafe(
        address userAddress,
        address nftContractAddress,
        uint256 ownerTokenId,
        uint256 userTokenId
    ) internal returns (address safeAddress) {
        address[] memory owners = new address[](2);
        bytes memory emptyData;
        SafeProxyFactory factory = SafeProxyFactory(
            0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2
        );
        SafeProxy proxy;
        NftGuard guard = new NftGuard(
            nftContractAddress,
            ownerTokenId,
            userTokenId
        );

        owners[0] = msg.sender;
        owners[1] = userAddress;

        Safe singleton = new Safe();

        // safe address
        proxy = factory.createProxyWithNonce(
            address(singleton),
            emptyData,
            block.timestamp
        );
        Safe(payable(proxy)).setup(
            owners,
            1, // threshold
            address(0), // Contract address for optional delegate call
            emptyData, // Data payload for optional delegate call
            address(0), // Handler for fallback calls to this contract
            address(0), // Token that should be used for the payment (0 is ETH)
            0, // Value that should be paid
            payable(0)
        ); // Address that should receive the payment (or 0 if tx.origin)

        // Set Guard
        Safe(payable(proxy)).setGuard(address(guard));

        return address(proxy);
    }
}
