// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "../lib/safe/contracts/base/GuardManager.sol";

interface ISafe {
    function getOwners() external view returns (address[] memory);
}

interface IDelegatePosition {
    function getValueOfUniswapPositionsFromWalletAddress(
        address walletAddress
    ) external view returns (uint256);
}

contract NftGuard is BaseGuard {
    address private delegateContractAddress;
    uint256 private oldPosition;

    /**
     *  constructor
     */
    constructor(address _delegateContractAddress) BaseGuard() {
        delegateContractAddress = _delegateContractAddress;
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
        address userAddress = owners[0];

        if (owners.length == 3) {
            userAddress = owners[1];
            // If the call is done to Safe Wallet, from user address, revert
            require(
                to != msg.sender || msgSender != userAddress,
                "NftGuard: Not allowed to call Safe wallet directly"
            );
        }

        oldPosition = IDelegatePosition(delegateContractAddress)
            .getValueOfUniswapPositionsFromWalletAddress(userAddress);
    }

    /**
     *  CheckAfterExecution
     */
    function checkAfterExecution(bytes32 txHash, bool success) external {
        address[] memory owners = ISafe(msg.sender).getOwners();

        if (owners.length == 3) {
            address userAddress = owners[1];
            uint256 newPosition = IDelegatePosition(delegateContractAddress)
                .getValueOfUniswapPositionsFromWalletAddress(userAddress);

            require(
                newPosition >= oldPosition,
                "NftGuard: Uniswap position decreased"
            );
        }

        delete oldPosition;
    }
}
