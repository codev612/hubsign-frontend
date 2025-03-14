import { CheckIcon } from "@/components/icons";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
  } from "@heroui/react";
import { useRouter } from "next/navigation";

interface ModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}
  
const ContactUsConfirmModal: React.FC<ModalProps> = ({
    isOpen,
    onOpenChange,
  }) => {

    const router = useRouter();

    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody>
                  <div className="flex flex-col gap-2 items-center">
                    <CheckIcon />
                    <p className="title-medium">Contact request was successfully sent</p>
                    <p className="text-text">Out team will contact you shortly</p>
                    <Button color="primary" className="w-full text-forecolor" fullWidth onPress={()=>router.push("/dashboard/documents/pending")}>
                        Go to the dashboard
                      </Button>
                    <Button variant="bordered" onPress={onClose} fullWidth>
                      Review Plans
                    </Button>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
};

export default ContactUsConfirmModal;  