import {
  Box,
  Button,
  Center,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalSuccess({ isOpen, onClose }: ModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Center>Success !</Center>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box border={"1px solid #E2E8F0"} padding={5}>
            <Flex justifyContent={"space-between"}>
              <Text>Position 1</Text>
              <Text>Position 1</Text>
              <Text>%</Text>
              <Text>hr</Text>
            </Flex>
          </Box>
          <Center marginTop={10}>
            <Text>Manage your positions</Text>
          </Center>
          <Box border={"1px solid #E2E8F0"} marginTop={10}>
            <Text>Safe infos</Text>
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
