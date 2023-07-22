// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {SafeProxyFactory, SafeProxy} from "../lib/safe/contracts/proxies/SafeProxyFactory.sol";
import {CustomSafe} from "./CustomSafe.sol";
import {ERC721, ERC721Enumerable} from "../lib/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {NftGuard} from "./NftGuard.sol";
import {OwnerManager} from "../lib/safe/contracts/base/OwnerManager.sol";
import {GuardManager} from "../lib/safe/contracts/base/GuardManager.sol";
import {Enum} from "../lib/safe/contracts/common/Enum.sol";
import {NftGuard} from "./NftGuard.sol";
import {INonfungiblePositionManager} from "../interfaces/INonfungiblePositionManager.sol";

contract PositionDelegation is ERC721Enumerable {
    address internal constant SENTINEL_OWNERS = address(0x1);

    mapping(address => address) public userToSafe;
    mapping(address => uint256[2]) public safeToTokenIds;
    mapping(uint256 => address) public tokenIdToSafe;
    address private immutable guardAddress;

    /**
     *  constructor
     */
    constructor() ERC721("PositionDelegation", "PD") {
        NftGuard guard = new NftGuard(address(this));
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
        address[] memory owners = new address[](1);
        bytes memory emptyData;
        SafeProxyFactory factory = SafeProxyFactory(
            0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2 // multichain address
        );
        SafeProxy proxy;

        owners[0] = address(this);

        CustomSafe singleton = new CustomSafe();

        // safe address
        proxy = factory.createProxyWithNonce(
            address(singleton),
            emptyData,
            block.timestamp
        );

        CustomSafe(payable(proxy)).setup(
            owners,
            1, // threshold
            address(0), // Contract address for optional delegate call
            emptyData, // Data payload for optional delegate call
            address(0), // Handler for fallback calls to this contract
            address(0), // Token that should be used for the payment (0 is ETH)
            0, // Value that should be paid
            payable(0)
        ); // Address that should receive the payment (or 0 if tx.origin)

        addOwnerToSafe(address(proxy), userAddress);

        // Set Guard
        CustomSafe(payable(proxy)).execTransaction(
            address(proxy),
            0,
            abi.encodeWithSelector(
                GuardManager.setGuard.selector,
                guardAddress
            ),
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            payable(0),
            emptyData
        );

        mintNftsForSafe(address(proxy));

        return address(proxy);
    }

    /**
     *  _transfer
        1. Get safeAddress from tokenIdToSafe
        2. Get 2 tokensIds from safeToTokenIds
        3. Get owners from tokensIds
        4. Get owners from Safe
     */
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721) {
        require(
            to != address(this),
            "ERC721: transfer to this contract not allowed"
        );

        address safeAddress = tokenIdToSafe[tokenId];
        uint256[2] memory tokenIds = safeToTokenIds[safeAddress];
        uint256 ownerTokenId = tokenIds[0];
        uint256 userTokenId = tokenIds[1];
        address ownerTokenOwner = ownerOf(ownerTokenId);
        address userTokenOwner = ownerOf(userTokenId);
        address[] memory owners = CustomSafe(payable(safeAddress)).getOwners();

        bool isOwnerTokenChange = ownerTokenId == tokenId;
        bool isUserTokenChange = userTokenId == tokenId;

        if (owners.length == 2) {
            addOwnerToSafe(safeAddress, to);
        } else if (owners.length == 3) {
            removeOwnerFromSafe(safeAddress, from);

            if (
                (isOwnerTokenChange && to != userTokenOwner) ||
                (isUserTokenChange && to != ownerTokenOwner)
            ) {
                addOwnerToSafe(safeAddress, to);
            }
        }

        super._transfer(from, to, tokenId);

        // CheckOrder
        // Owner should always be the first owner
        if (owners.length == 3) {
            owners = CustomSafe(payable(safeAddress)).getOwners();
            ownerTokenOwner = ownerOf(ownerTokenId);
            if (owners[1] == ownerTokenOwner) {
                removeOwnerFromSafe(safeAddress, ownerTokenOwner);
                addOwnerToSafe(safeAddress, ownerTokenOwner);
            }
        }
    }

    /**
     *  _baseURI
     */
    function _baseURI()
        internal
        view
        virtual
        override(ERC721)
        returns (string memory)
    {
        return "https://position-api.onrender.com/api/token/metadata?tokenId=";
    }

    /**
     *  addOwnerToSafe
     */
    function addOwnerToSafe(
        address safeAddress,
        address ownerAddress
    ) internal {
        bytes memory emptyData;
        CustomSafe(payable(safeAddress)).execTransaction(
            safeAddress,
            0,
            abi.encodeWithSelector(
                OwnerManager.addOwnerWithThreshold.selector,
                ownerAddress,
                1
            ),
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            payable(0),
            emptyData
        );
    }

    /**
     *  removeOwnerFromSafe
     */
    function removeOwnerFromSafe(
        address safeAddress,
        address ownerAddress
    ) internal {
        bytes memory emptyData;
        address[] memory owners = CustomSafe(payable(safeAddress)).getOwners();
        address prevAddress = owners[0] == ownerAddress
            ? SENTINEL_OWNERS
            : owners[0];
        CustomSafe(payable(safeAddress)).execTransaction(
            safeAddress,
            0,
            // removeOwner(address prevOwner, address owner, uint256 _threshold)
            abi.encodeWithSelector(
                OwnerManager.removeOwner.selector,
                prevAddress,
                ownerAddress,
                1
            ),
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            payable(0),
            emptyData
        );
    }

    /**
     *  mintNftsForSafe
     */
    function mintNftsForSafe(address safeAddress) private {
        if (safeToTokenIds[safeAddress][0] != 0) {
            return;
        }

        uint256 ownerTokenId = totalSupply() + 1;
        _mint(msg.sender, ownerTokenId);
        uint256 userTokenId = totalSupply() + 1;
        _mint(msg.sender, userTokenId);

        safeToTokenIds[safeAddress][0] = ownerTokenId;
        safeToTokenIds[safeAddress][1] = userTokenId;
        tokenIdToSafe[ownerTokenId] = safeAddress;
        tokenIdToSafe[userTokenId] = safeAddress;
    }

    /**
     *  delegate
     */
    function delegate(
        address tokenAddress,
        uint256[] memory tokenIds
    ) public returns (address returnedSafeAddress) {
        require(
            tokenIds.length > 0,
            "tokenIds length should be greater than 0"
        );

        address safeAddress = getOrCreateSafe(msg.sender);

        ERC721 tokenContract = ERC721(tokenAddress);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            tokenContract.transferFrom(msg.sender, safeAddress, tokenId);
        }

        return safeAddress;
    }

    /**
     *  getSafeAddressForUser
     */
    function getSafeAddressForUser(
        address userAddress
    ) public view returns (address safeAddress) {
        return userToSafe[userAddress];
    }

    /**
     *  getSafeAddressForTokenId
     */
    function getSafeAddressForTokenId(
        uint256 tokenId
    ) public view returns (address safeAddress) {
        return tokenIdToSafe[tokenId];
    }

    /**
     *  isTokenIdOwner
     */
    function isTokenIdOwner(
        uint256 tokenId
    ) public view returns (bool isOwner) {
        address safeAddress = tokenIdToSafe[tokenId];

        return safeToTokenIds[safeAddress][0] == tokenId;
    }

    /**
     *  getValueOfUniswapPositionsFromWalletAddress
     */
    function getValueOfUniswapPositionsFromWalletAddress(
        address userAddress
    ) public view returns (uint256) {
        ERC721Enumerable uniswapContract = ERC721Enumerable(
            0xC36442b4a4522E871399CD717aBDD847Ab11FE88
        );
        INonfungiblePositionManager uniswapNftPositionManager = INonfungiblePositionManager(
                0xC36442b4a4522E871399CD717aBDD847Ab11FE88
            );

        uint256 positionsNumber = uniswapContract.balanceOf(userAddress);
        uint256 valuesSum = 0;

        for (uint256 i = 0; i < positionsNumber; i++) {
            uint256 tokenId = uniswapContract.tokenOfOwnerByIndex(
                userAddress,
                i
            );
            (
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                uint256 liquidity,
                ,
                ,
                ,

            ) = uniswapNftPositionManager.positions(tokenId);
            valuesSum += liquidity;
        }

        return valuesSum;
    }

    /**
     *  getValueOfUniswapPositionsFromTokenId
     */
    function getValueOfUniswapPositionsFromTokenId(
        uint256 tokenId
    ) public view returns (uint256) {
        address safeAddress = tokenIdToSafe[tokenId];

        return getValueOfUniswapPositionsFromWalletAddress(safeAddress);
    }
}
