// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {SafeProxyFactory, SafeProxy} from "../lib/safe/contracts/proxies/SafeProxyFactory.sol";
import {Safe} from "../lib/safe/contracts/Safe.sol";
import {NftGuard, ISafe} from "./NftGuard.sol";
import {ERC721, ERC721Enumerable} from "../lib/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {OwnerManager} from "../lib/safe/contracts/base/OwnerManager.sol";
import {GuardManager} from "../lib/safe/contracts/base/GuardManager.sol";
import {Enum} from "../lib/safe/contracts/common/Enum.sol";

contract PositionDelegation is ERC721Enumerable {
    mapping(address => address) public userToSafe;
    mapping(address => uint256[2]) public safeToTokenIds;
    mapping(uint256 => address) public tokenIdToSafe;
    address private immutable guardAddress;

    /**
     *  constructor
     */
    constructor(
        address _wethContractAddress
    ) ERC721("PositionDelegation", "PD") {
        NftGuard guard = new NftGuard(_wethContractAddress);
        guardAddress = address(guard);
    }

    /**
     *  getOrCreateSafe
     */
    function getOrCreateSafe(
        address userAddress
    ) public returns (address safeAddress) {
        address safe = userToSafe[userAddress];
        if (safe == address(0)) {
            safe = createSafe(userAddress);

            userToSafe[userAddress] = safe;
        }
        return safe;
    }

    /**
     *  createSafe
     */
    function createSafe(
        address userAddress
    ) internal returns (address safeAddress) {
        address[] memory owners = new address[](2);
        bytes memory emptyData;
        SafeProxyFactory factory = SafeProxyFactory(
            0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2 // multichain address
        );
        SafeProxy proxy;

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
        // Safe(payable(proxy)).setGuard(guardAddress);

        // Safe(payable(proxy)).execTransaction(
        //     address(proxy),
        //     0,
        //     abi.encodeWithSelector(
        //         GuardManager.setGuard.selector,
        //         guardAddress
        //     ),
        //     Enum.Operation.Call,
        //     0,
        //     0,
        //     0,
        //     address(0),
        //     payable(0),
        //     emptyData
        // );

        return address(proxy);
    }

    /**
     *  _transfer
     */
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721) {
        bytes memory emptyData;
        address safeAddress = tokenIdToSafe[tokenId];
        address[] memory owners = Safe(payable(safeAddress)).getOwners();
        address SENTINEL_OWNERS = address(0x1);

        address prevAddress = owners[0] == from ? SENTINEL_OWNERS : owners[0];
        Safe(payable(safeAddress)).execTransaction(
            safeAddress,
            0,
            abi.encodeWithSelector(
                OwnerManager.swapOwner.selector,
                prevAddress,
                from,
                to
            ),
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            payable(0),
            emptyData
        );

        super._transfer(from, to, tokenId);
    }

    /**
     *  delegate
     */
    function delegate() public {
        address safeAddress = getOrCreateSafe(msg.sender);

        uint256 ownerTokenId = totalSupply() + 1;
        _mint(address(this), ownerTokenId);
        uint256 userTokenId = totalSupply() + 1;
        _mint(msg.sender, userTokenId);

        safeToTokenIds[safeAddress][0] = ownerTokenId;
        safeToTokenIds[safeAddress][1] = userTokenId;
        tokenIdToSafe[ownerTokenId] = safeAddress;
        tokenIdToSafe[userTokenId] = safeAddress;
    }
}
