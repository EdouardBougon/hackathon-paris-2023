import {
  CardBody,
  Card,
  Flex,
  Container,
  Img,
  Center,
  Checkbox,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Alchemy, OwnedNft } from "alchemy-sdk";
import {
  settings,
  uniswapNftAddress,
  uniswapPackageManager,
} from "../../settings";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useContractReads } from "wagmi";
import { ButtonTx } from "../buttonTx/ButtonTx";
import { BtnOpenModal } from "../btnOpenModal/BtnOpenModal";

const alchemy = new Alchemy(settings);

const abi = [
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "positions",
    outputs: [
      {
        internalType: "uint96",
        name: "nonce",
        type: "uint96",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "address",
        name: "token0",
        type: "address",
      },
      {
        internalType: "address",
        name: "token1",
        type: "address",
      },
      {
        internalType: "uint24",
        name: "fee",
        type: "uint24",
      },
      {
        internalType: "int24",
        name: "tickLower",
        type: "int24",
      },
      {
        internalType: "int24",
        name: "tickUpper",
        type: "int24",
      },
      {
        internalType: "uint128",
        name: "liquidity",
        type: "uint128",
      },
      {
        internalType: "uint256",
        name: "feeGrowthInside0LastX128",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "feeGrowthInside1LastX128",
        type: "uint256",
      },
      {
        internalType: "uint128",
        name: "tokensOwed0",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "tokensOwed1",
        type: "uint128",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function CardPosition() {
  const { address } = useAccount();
  const [positions, setPositions] = useState<OwnedNft[] | null>(null);
  const [tokenIds, setTokenIds] = useState<bigint[]>([]);
  const [TotalValue, setTotalValue] = useState<number[]>([]);

  useContractReads({
    contracts: positions?.map((position) => ({
      address: uniswapPackageManager,
      abi: abi,
      functionName: "positions",
      args: [position.tokenId],
    })),
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      const totalValue: number[] = [];
      data?.forEach((position) => {
        position && totalValue.push(Number((position.result as any)[7]) / 1e6);
      });
      setTotalValue(totalValue);
    },
  });

  // get all nft positions from uniswap v3 with alchemy
  const getUniswapV3Positions = useCallback(async () => {
    if (!address) return;
    const positions = await alchemy.nft.getNftsForOwner(address, {
      contractAddresses: [uniswapNftAddress],
    });
    setPositions(positions.ownedNfts);
  }, [address]);

  useEffect(() => {
    getUniswapV3Positions();
  }, [getUniswapV3Positions]);

  return (
    <Container maxW="1000px">
      <Flex marginTop={30} gap={10} justify={"center"}>
        {positions && positions.length === 0 && (
          <Center>
            <Text>No positions found</Text>
          </Center>
        )}
        {positions === null && (
          <Center>
            <Spinner />
          </Center>
        )}
        {positions &&
          positions.map((position, index) => (
            <Card
              key={position.tokenId}
              cursor={"pointer"}
              onClick={() => {
                if (tokenIds.includes(BigInt(position.tokenId))) {
                  setTokenIds(
                    tokenIds.filter(
                      (id) => BigInt(id) !== BigInt(position.tokenId)
                    )
                  );
                } else {
                  setTokenIds([...tokenIds, BigInt(position.tokenId)]);
                }
              }}
              border={
                tokenIds.includes(BigInt(position.tokenId))
                  ? "3px solid #3060e5"
                  : ""
              }
            >
              <Checkbox
                position="absolute"
                top="10px"
                right="10px"
                isChecked={tokenIds.includes(BigInt(position.tokenId))}
              ></Checkbox>
              <CardBody>
                <Center>
                  <Img w="60%" src={position.media[0].gateway} />
                </Center>
                <Center>
                  <Text marginTop={5}>
                    Total value : ${TotalValue[index] * 2}
                  </Text>
                </Center>
              </CardBody>
            </Card>
          ))}
      </Flex>
      {/* <SliderAmount /> */}
      <ButtonTx tokenIds={tokenIds} />
      <BtnOpenModal />
    </Container>
  );
}
