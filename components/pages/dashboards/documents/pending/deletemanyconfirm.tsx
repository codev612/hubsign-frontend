import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
  } from "@heroui/react";
  import Cookies from "js-cookie";
  
  interface ConfirmModalProps {
    isOpen: boolean;
    // onOpen: () => void;
    onOpenChange: (isOpen: boolean) => void;
    action: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  const ManyConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onOpenChange,
    action,
  }) => {
  
    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Delete Document</ModalHeader>
                <ModalBody>
                </ModalBody>
                <ModalFooter>
                  <Button variant="bordered" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="danger" onPress={()=>action(true)}>
                    Delete Document
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default ManyConfirmModal;  