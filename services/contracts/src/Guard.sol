// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../lib/safe/contracts/base/GuardManager.sol";
import "../lib/@openzeppelin/contracts/interfaces/IERC721.sol";
import "../lib/safe/contracts/Safe.sol";

interface ISafe {
    function getOwners() external view returns (address[] memory);
}

contract NftGuard is BaseGuard {
    address private nftContractAddress;
    uint256 private ownerTokenId;
    uint256 private userTokenId;

    constructor(
        address _nftContractAddress,
        uint256 _ownerTokenId,
        uint256 _userTokenId
    ) BaseGuard() {
        nftContractAddress = _nftContractAddress;
        ownerTokenId = _ownerTokenId;
        userTokenId = _userTokenId;
    }

    function checkTransaction(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address payable refundReceiver,
        bytes memory signatures,
        address msgSender
    ) external {
        address[] memory owners = ISafe(msg.sender).getOwners();
        address ownerAddress = owners[0];

        // If the call is done to Safe Wallet, from another address than the owner, revert
        if (to == msg.sender && msgSender != ownerAddress) {
            revert("NftGuard: Not allowed to call Safe wallet directly");
        }
    }

    function checkAfterExecution(bytes32 txHash, bool success) external {}
}
