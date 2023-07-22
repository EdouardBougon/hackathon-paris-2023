import { Flex, Box, Heading, Spacer, ButtonGroup } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navbar() {
  return (
    <Flex
      minWidth="max-content"
      alignItems="center"
      gap="2"
      padding={5}
      shadow={"0px 0px 10px 0px rgba(0,0,0,0.25)"}
    >
      <Box p="2">
        <Heading size="md">Chakra App</Heading>
      </Box>
      <Spacer />
      <ButtonGroup gap="2">
        <ConnectButton />
      </ButtonGroup>
    </Flex>
  );
}
