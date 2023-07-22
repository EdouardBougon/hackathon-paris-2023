import {
  Box,
  Button,
  ButtonGroup,
  Center,
  useDisclosure,
} from "@chakra-ui/react";
import { ModalSuccess } from "../modal/Modal";

export function ButtonTx() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Center marginTop="10">
        <ButtonGroup spacing="6">
          <Button colorScheme="teal" size="sm" onClick={onOpen}>
            SAFE BUNDLE AND BORROW
          </Button>
        </ButtonGroup>
      </Center>
      <ModalSuccess isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
