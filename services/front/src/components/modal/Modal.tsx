import {
  Box,
  Button,
  Center,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import QRCode from "react-qr-code";
import { usePositionDelegationGetSafeAddressForUser } from "../../generated";
import { contractDelegation } from "../../settings";
import { useAccount } from "wagmi";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalSuccess({ isOpen, onClose }: ModalProps) {
  const { address } = useAccount();
  const { data: safeAddress } = usePositionDelegationGetSafeAddressForUser({
    address: contractDelegation,
    args: [address ? address : "0x0000000"],
    onSuccess: (data) => {
      console.log(data);
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Center>Success !</Center>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* <Box border={"1px solid #E2E8F0"} padding={5}>
            <Flex justifyContent={"space-between"}>
              <Text>Position 1</Text>
              <Text>Position 1</Text>
              <Text>%</Text>
              <Text>hr</Text>
            </Flex>
          </Box> */}
          {/* <Center marginTop={10}>
            <Text>Manage your positions</Text>
          </Center> */}
          <Center>
            <Link
              href={`https://app.safe.global/home?safe=matic:${safeAddress}`}
              target="_blanck"
              rel="noreferrer"
              textDecoration={"underline"}
              color={"blue"}
            >
              Link to your safe wallet
            </Link>
          </Center>
          <Center marginTop={10}>
            <Text>QR Code :</Text>
          </Center>
          <Box border={"1px solid #E2E8F0"} marginTop={2}>
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={`https://app.safe.global/home?safe=matic:${safeAddress}`}
              viewBox={`0 0 256 256`}
            />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Ok
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
