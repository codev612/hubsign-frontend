import { useEffect, useState } from "react";
import { Recipient } from "@/interface/interface";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Checkbox,
  } from "@heroui/react";
import Cookies from "js-cookie";
import Recipients from "../template/recipients";
import { useUser } from "@/context/user";

interface Activity {
  username: string;
  action: string;
}

const roles = [
  {
    name: 'sender',
    email: 'sender'
  },
  {
    name: 'signer',
    email: 'signer'
  },
  {
    name: 'client',
    email: 'client'
  },
]

interface DocData {
    uid: string;
    owner: string
    name: string;
    recipients: Recipient[];
    sendDate: string;
    status: string;
    sentAt: string;
    activity: Activity[];
    signingOrder: boolean;
}

interface ModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    action: (recepients: Recipient[], name: string, signingOrder:boolean) => void;
    selectedItemData: DocData;
}
  
const SaveTempModal: React.FC<ModalProps> = ({
    isOpen,
    onOpenChange,
    action,
    selectedItemData,
  }) => {
    const userContextValues = useUser();

    const [tempName, setTempName] = useState<string>("");
    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [customSigningOrder, setCustomSigningOrder] = useState<boolean>(false);
    const [contacts, setContacts] = useState<Recipient[]>(userContextValues.contacts);
    const [rec2Roles, setRec2Roles] = useState<Recipient[]>([]);

    useEffect(() => {
        setTempName(selectedItemData.name)
        setRecipients(selectedItemData.recipients);
        setCustomSigningOrder(selectedItemData.signingOrder);
    }, [selectedItemData])

    useEffect(() => {
      const roles = recipients.map( item => {
        return {name:'signer', email:'singer'}
      });
      setRec2Roles(roles);
    }, [recipients])

    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Save as Template</ModalHeader>
                <ModalBody>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col ">
                            <h1 className="title-small">Template Name</h1>
                            <input 
                            placeholder="Enter a template name" 
                            className="w-full border-1 rounded-lg p-2"
                            value={tempName}
                            onChange={(e)=>setTempName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex flex-row justify-between items-center w-full">
                                <h1 className="title-small">Add Recipients</h1>
                                <Checkbox
                                className="text-white"
                                isSelected={customSigningOrder}
                                onValueChange={setCustomSigningOrder}
                                >
                                Custom singing order
                                </Checkbox>
                            </div>
                            <Recipients
                            customSigningOrder={customSigningOrder}
                            user={{name:`${userContextValues.userData.firstname} ${userContextValues.userData.lastname}`, email: userContextValues.userData.email}}
                            contacts={roles}
                            recipients={rec2Roles}
                            setRecipient={setRec2Roles}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                  <Button variant="bordered" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" className="text-forecolor" onPress={()=>action(rec2Roles, tempName, customSigningOrder)}>
                    Save Template
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
};

export default SaveTempModal;  