import { useEffect } from "react";
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
  message: string;
  title: string;
  id: string[];
  actionState: (state: boolean) => void;
  // onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void; // Adjust if the signature for onOpenChange is different
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onOpenChange,
  message,
  title,
  id,
  actionState,
}) => {

  const handleAction = async () => {
    if (id.length) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/contacts`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("session") || ""}`,
          },
          body: JSON.stringify({ ids: id }),
        });

        if (!response.ok) {
          actionState(false);
        } else {
          onOpenChange(false);
          actionState(true);
        }
      } catch (error) {
        throw new Error("Server error");
      }
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>
                <p>{message}</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onClose}>
                  Close
                </Button>
                <Button color="danger" onPress={handleAction}>
                  Delete
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
