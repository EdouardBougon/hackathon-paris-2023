// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "../lib/safe/contracts/base/GuardManager.sol";
import "../lib/@openzeppelin/contracts/interfaces/IERC721.sol";
import "../lib/@openzeppelin/contracts/interfaces/IERC20.sol";
import "../lib/safe/contracts/Safe.sol";

interface ISafe {
    function getOwners() external view returns (address[] memory);
}

contract NftGuard is BaseGuard {
    address private wethContractAddress;
    uint256 private oldWethAmount;

    /**
     *  constructor
     */
    constructor(address _wethContractAddress) BaseGuard() {
        wethContractAddress = _wethContractAddress;
    }

    /**
     *  checkTransaction
     */
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
        address userAddress = owners[2];

        if (owners.length == 3) {
            // If the call is done to Safe Wallet, from user address, revert
            require(
                to != msg.sender || msgSender != userAddress,
                "NftGuard: Not allowed to call Safe wallet directly"
            );
        }

        oldWethAmount = IERC20(wethContractAddress).balanceOf(userAddress);
    }

    /**
     *  CheckAfterExecution
     */
    function checkAfterExecution(bytes32 txHash, bool success) external {
        address[] memory owners = ISafe(msg.sender).getOwners();

        if (owners.length == 3) {
            address userAddress = owners[2];
            uint256 newWethAmount = IERC20(wethContractAddress).balanceOf(
                userAddress
            );

            require(
                newWethAmount >= oldWethAmount,
                "NftGuard: WETH balance decreased"
            );
        }

        delete oldWethAmount;
    }
}
