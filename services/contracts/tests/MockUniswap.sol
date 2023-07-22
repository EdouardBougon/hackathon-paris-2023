// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {ERC721, ERC721Enumerable} from "../lib/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MockERC721 is ERC721Enumerable {
    constructor(
        string memory name_,
        string memory symbol_
    ) ERC721(name_, symbol_) {}

    function mint(address to, uint256 tokenId) public virtual {
        _mint(to, tokenId);
    }

    function burn(uint256 tokenId) public virtual {
        _burn(tokenId);
    }

    function safeMint(address to, uint256 tokenId) public virtual {
        _safeMint(to, tokenId);
    }

    function safeMint(
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual {
        _safeMint(to, tokenId, data);
    }
}
