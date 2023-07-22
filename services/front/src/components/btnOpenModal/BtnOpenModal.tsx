import { Button, Center, useDisclosure } from "@chakra-ui/react";
import { ModalSuccess } from "../modal/Modal";

export function BtnOpenModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Center marginTop="10">
        <Button onClick={onOpen}>Safe infos</Button>
      </Center>

      <ModalSuccess isOpen={isOpen} onClose={onClose} />
    </>
  );
}
