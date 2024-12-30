import { useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

interface ConfirmModalProps {
    isOpen: boolean;
    message: string;
    title: string;
    // onOpen: () => void;
    onOpenChange: (isOpen: boolean) => void; // Adjust if the signature for onOpenChange is different
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({isOpen, onOpenChange, message, title}) => {
    
    useEffect(()=>{
      console.log("isopen",isOpen)
    },[isOpen])
    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                <ModalBody>
                  <p>
                    {message}
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Delete
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
}

export default ConfirmModal;