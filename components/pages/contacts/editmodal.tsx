import { useEffect, useState, useActionState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input
} from "@heroui/react";
import { updateContact } from "@/app/dashboard/contacts/action";
import { ActionInitialState } from "@/interface/interface"

import Cookies from "js-cookie";

interface ModalProps {
  isOpen: boolean;
  title: string;
  item: any;
  actionState: ({state, data}:{state: boolean; data:any}) => void;
  // onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void; // Adjust if the signature for onOpenChange is different
}

const initialState: ActionInitialState = {
    state:"",
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
    console.log(item);
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
    if( state.state==="success" ) {
        console.log(state.data)
        actionState({state: true, data:state.data});
        onOpenChange(false);
    } else {
        actionState({state: false, data:{}});
    }
  }, [state]);

  const handleAction = async () => {
    // if (item.id==="") {
    //   try {
    //     const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/contacts`, {
    //       method: "DELETE",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${Cookies.get("session") || ""}`,
    //       },
    //       body: JSON.stringify({ ids: id }),
    //     });

    //     console.log(id);
    //     if (!response.ok) {
    //       actionState(false);
    //     } else {
    //       onOpenChange(false);
    //       actionState(true);
    //     }
    //   } catch (error) {
    //     throw new Error("Server error");
    //   }
    // }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <form
        action={formAction}
        onSubmit={() => setIsLoading(true)}
        >
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                <ModalBody className="text-sm">
                    <label>Contact name</label>
                    <input 
                    name="name" 
                    type="text" 
                    placeholder="Enter contact name" 
                    className="border-1 rounded-lg p-2"
                    value={name}
                    onChange={(e)=>setName(e.target.value)} 
                    required />
                    <label>Contact email</label>
                    <input 
                    name="email" 
                    type="email" 
                    placeholder="Enter contact email" 
                    className="border-1 rounded-lg p-2" 
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required />
                    <input hidden readOnly name="id" value={item.id} />
                </ModalBody>
                <ModalFooter>
                    <Button variant="bordered" onPress={onClose}>
                    Close
                    </Button>
                    <Button type="submit" className="text-white" color="primary" isLoading={isLoading} >
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
