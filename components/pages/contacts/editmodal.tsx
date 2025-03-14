import { useEffect, useState, useActionState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

import { updateContact } from "@/app/dashboard/contacts/action";
import { ActionInitialState } from "@/interface/interface";

interface ModalProps {
  isOpen: boolean;
  title: string;
  item: any;
  actionState: ({ state, data }: { state: boolean; data: any }) => void;
  // onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void; // Adjust if the signature for onOpenChange is different
}

const initialState: ActionInitialState = {
  state: "",
  data: {},
  message: "",
  isLoading: false,
};

const EditModal: React.FC<ModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  item,
  actionState,
}) => {
  useEffect(() => {
    setName(item.name);
    setEmail(item.email);
    setId(item.id);
  }, [item]);

  const [state, formAction] = useActionState(updateContact, initialState);

  const [email, setEmail] = useState<string>(item.name);
  const [name, setName] = useState<string>(item.email);
  const [id, setId] = useState<string>(item.id);
  const [isLoading, setIsLoading] = useState<boolean>(false); // loading button

  useEffect(() => {
    setIsLoading(state.isLoading || false);
    if (state.state === "success") {
      actionState({ state: true, data: state.data });
      onOpenChange(false);
      handleReset();
    } else {
      actionState({ state: false, data: {} });
    }
  }, [state]);

  const handleReset = () => {
    setEmail("");
    setName("");
    setId("");
    setIsLoading(false);
  }

  return (
    <>
      <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange} 
      onClose={()=>handleReset()}
      onLoadStart={()=>console.log('load start')}
      >
        <form action={formAction} onSubmit={() => setIsLoading(true)}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {title}
                </ModalHeader>
                <ModalBody className="text-sm">
                  <label htmlFor="name">Contact name</label>
                  <input
                    required
                    className="border-1 rounded-lg p-2"
                    id="name"
                    name="name"
                    placeholder="Enter contact name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label htmlFor="email">Contact email</label>
                  <input
                    required
                    className="border-1 rounded-lg p-2"
                    id="email"
                    name="email"
                    placeholder="Enter contact email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input hidden readOnly name="id" value={id} />
                </ModalBody>
                <ModalFooter>
                  <Button variant="bordered" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    className="text-white"
                    color="primary"
                    isLoading={isLoading}
                    type="submit"
                  >
                    Save Contact
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default EditModal;
