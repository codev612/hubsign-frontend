import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
  } from "@heroui/react";
  import Cookies from "js-cookie";
  
  interface ModalProps {
    isOpen: boolean;
    // onOpen: () => void;
    onOpenChange: (isOpen: boolean) => void;
    action: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    description: string;
  }
  
  const ConfirmModal: React.FC<ModalProps> = ({
    isOpen,
    onOpenChange,
    action,
    title,
    description,
  }) => {
  
    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Delete {title}</ModalHeader>
                <ModalBody>
                    <p>{description}</p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="bordered" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="danger" onPress={()=>action(true)}>
                    Delete {title}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default ConfirmModal;  