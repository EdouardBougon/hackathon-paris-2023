// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Safe} from "../lib/safe/contracts/Safe.sol";

contract CustomeSafe is Safe {
    constructor() Safe() {}

    function checkSignatures(
        bytes32 dataHash,
        bytes memory data,
        bytes memory signatures
    ) public view override {}
}
