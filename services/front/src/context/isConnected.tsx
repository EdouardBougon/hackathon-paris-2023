import { Box, Center } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ReactNode } from "react";
import { useAccount } from "wagmi";

export function IsConnected({ children }: { children: ReactNode }) {
  const { status } = useAccount();

  if (status === "disconnected") {
    return (
      <Box marginTop="300">
        <Center>
          <ConnectButton />
        </Center>
      </Box>
    );
  }

  return <>{children}</>;
}
