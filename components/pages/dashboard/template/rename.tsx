import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
  } from "@heroui/react";
  import Cookies from "js-cookie";
import { useEffect, useState } from "react";
  
  interface ModalProps {
    isOpen: boolean;
    // onOpen: () => void;
    onOpenChange: (isOpen: boolean) => void;
    action: React.Dispatch<React.SetStateAction<string>>;
    title: string;
    description: string;
    currentName: string;
  }
  
  const RenameModal: React.FC<ModalProps> = ({
    isOpen,
    onOpenChange,
    action,
    title,
    description,
    currentName,
  }) => {

    const [name, setName] = useState<string>("");

    useEffect(() => {
        setName(currentName)
    }, [currentName])
  
    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                <ModalBody>
                    <div className="flex flex-col">
                        <p className="text-text">Template Name</p>
                        <input value={name} onChange={(e)=>setName(e.target.value)} className="border-1 rounded-lg p-2" />
                    </div>
                </ModalBody>
                <ModalFooter>
                  <Button variant="bordered" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={()=>action(name)} className="text-forecolor">
                    Save
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default RenameModal;  