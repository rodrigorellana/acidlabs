import React from 'react';
import {
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  AlertDialog,
  Button,
  useDisclosure,

} from "@chakra-ui/react";

interface IDialogProps {
  message: string;
  title?: string;
  body?: string;
  okClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export default function Dialog({ message, title, body, okClick, isLoading }: IDialogProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef() as React.RefObject<HTMLButtonElement>;
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      okClick(event);
    } finally {
      onClose();
    }
  }

  return (
    <>
      <Button isLoading={isLoading} onClick={onOpen}>{message}</Button>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>{title || 'Acid Labs'}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{body || 'Are you sure?'}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}> No</Button>
            <Button ref={cancelRef} colorScheme='red' onClick={handleClick} ml={3}> Yes </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}