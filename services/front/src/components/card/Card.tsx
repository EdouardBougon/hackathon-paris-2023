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
import { settings, uniswapNftAddress } from "../../settings";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ButtonTx } from "../buttonTx/ButtonTx";

const alchemy = new Alchemy(settings);

export function CardPosition() {
  const { address } = useAccount();
  const [positions, setPositions] = useState<OwnedNft[] | null>(null);
  const [tokenIds, setTokenIds] = useState<bigint[]>([]);

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
          positions.map((position) => (
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
              </CardBody>
            </Card>
          ))}
      </Flex>
      {/* <SliderAmount /> */}
      <ButtonTx tokenIds={tokenIds} />
    </Container>
  );
}
