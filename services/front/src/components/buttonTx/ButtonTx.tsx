import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { ModalSuccess } from "../modal/Modal";
import { usePositionDelegationDelegate } from "../../generated";
import { contractDelegation, uniswapNftAddress } from "../../settings";
import { useWaitForTransaction } from "wagmi";

interface ButtonTxProps {
  tokenIds: bigint[];
}

export function ButtonTx({ tokenIds }: ButtonTxProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, write } = usePositionDelegationDelegate({
    address: contractDelegation,
    args: [uniswapNftAddress, tokenIds],
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
          <Button
            colorScheme="teal"
            size="sm"
            onClick={() => {
              write();
            }}
          >
            {isLoading ? (
              <Spinner />
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
        </ButtonGroup>
      </Center>
      <ModalSuccess isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
