import { Button, Spinner } from "@chakra-ui/react";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { contractDelegation, uniswapNftAddress } from "../../settings";
import { erc721EnumerableABI } from "../../generated";

export function ButtonApprove() {
  const { data, write } = useContractWrite({
    address: uniswapNftAddress,
    abi: erc721EnumerableABI,
    functionName: "setApprovalForAll",
    args: [contractDelegation, true],
  });

  const { isError, isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
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
        "Approve tokens"
      )}
    </Button>
  );
}
