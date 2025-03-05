import { useEffect, useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { useCanvas } from "@/context/canvas";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onOpenChange: (isOpen: boolean) => void;
  recepients: string[];
}

const ReviewModal: React.FC<ModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  recepients,
}) => {

    const canvasContextValues = useCanvas();

    const onClose = () => {
        canvasContextValues.setShowReviewModal(false);
    }

    const handleAccept = () => {
        
    };

    return (
        <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        size="4xl"
        onOpenChange={onOpenChange}
        onClose={onClose}
        >
            <ModalContent>
                {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col title-medium">
                            <h1>Recepients</h1>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                    <Button variant="bordered" onPress={onClose}>
                        Back
                    </Button>
                    <Button
                        className="text-white"
                        color="primary"
                        type="submit"
                        onPress={() => handleAccept()}
                    >
                        Send this document
                    </Button>
                    </ModalFooter>
                </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ReviewModal;
