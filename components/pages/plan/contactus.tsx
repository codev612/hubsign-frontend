import { useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
  } from "@heroui/react";

interface ModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    action: (username: string, email: string) => void;
}
  
const ContactUsModal: React.FC<ModalProps> = ({
    isOpen,
    onOpenChange,
    action,
  }) => {

    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const handleAction = () => {
        if(username !== "" && email !== "") {
            action(username, email);
        }
    }

    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                    Contact Us
                </ModalHeader>
                <ModalBody>
                    <p className="text-text">Please fill in the form below and we will contact you shortly</p>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col ">
                            <h1 className="title-small">Name</h1>
                            <input 
                            placeholder="Enter your name" 
                            className="w-full border-1 rounded-lg p-2"
                            value={username}
                            onChange={(e)=>setUsername(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col ">
                            <h1 className="title-small">Email</h1>
                            <input 
                            placeholder="Enter your email" 
                            className="w-full border-1 rounded-lg p-2"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" className="text-forecolor" onPress={handleAction} fullWidth>
                    Send
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
};

export default ContactUsModal;  