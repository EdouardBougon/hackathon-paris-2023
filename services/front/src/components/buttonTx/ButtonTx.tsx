import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { ModalSuccess } from "../modal/Modal";
import {
  erc721EnumerableABI,
  usePositionDelegationDelegate,
} from "../../generated";
import { contractDelegation, uniswapNftAddress } from "../../settings";
import { useAccount, useContractRead, useWaitForTransaction } from "wagmi";
import { ButtonApprove } from "../buttonApprove/buttonApprove";

interface ButtonTxProps {
  tokenIds: bigint[];
}

export function ButtonTx({ tokenIds }: ButtonTxProps) {
  const { address } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, write } = usePositionDelegationDelegate({
    address: contractDelegation,
    args: [uniswapNftAddress, tokenIds],
  });

  const { data: isApprovedForAll } = useContractRead({
    watch: true,
    address: uniswapNftAddress,
    abi: erc721EnumerableABI,
    functionName: "isApprovedForAll",
    args: [address ?? "0x", contractDelegation],
  });

  const { isError, isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      onOpen();
    },
  });

  return (
    <Box>
      <Center marginTop="10">
        <ButtonGroup spacing="6">
          {isApprovedForAll ? (
            <Button
              colorScheme="teal"
              size="sm"
              onClick={() => {
                write();
              }}
            >
              {isLoading ? (
                <Spinner />
              ) : tokenIds.length === 0 ? (
                "No tokens selected"
              ) : isSuccess ? (
                "Success!"
              ) : isError ? (
                "Error!"
              ) : data ? (
                "Success!"
              ) : (
                "SAFE BUNDLE AND BORROW"
              )}
            </Button>
          ) : (
            <ButtonApprove />
          )}
        </ButtonGroup>
      </Center>
      <ModalSuccess isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
