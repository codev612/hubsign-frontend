import { useEffect, useState, useActionState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Tabs,
  Tab,
  Chip
} from "@heroui/react";
import { updateContact } from "@/app/dashboard/contacts/action";
import { ActionInitialState } from "@/interface/interface"

import Cookies from "js-cookie";
import Dot from "@/components/common/dot";

interface ModalProps {
  isOpen: boolean;
  title: string;
  item: any;
  actionState: ({state, data}:{state: boolean; data:any}) => void;
  // onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void; // Adjust if the signature for onOpenChange is different
}

const fontColor = [
  "#111111",
  "#184CAA",
  "#B92812",
]

const SignatureEditModal: React.FC<ModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  item,
  actionState,
}) => {

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                <ModalBody>
                  <Tabs
                    aria-label="Options"
                    classNames={{
                      tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                      cursor: "w-full bg-primary",
                      tab: "max-w-fit px-0 h-12",
                      tabContent: "group-data-[selected=true]:text-primary",
                    }}
                    color="primary"
                    variant="underlined"
                  >
                    <Tab
                      key="draw"
                      title={
                        <div className="flex items-center space-x-2">
                          <span>Draw</span>
                        </div>
                      }
                    >
                      <div className="flex flex-col">
                        <div className="flex flex-row">
                          <div>
                            <ul className="text-text flex flex-row justify-center items-center gap-1">
                              <li>Color</li>
                              {fontColor.map(item=><li key={item}>
                                <Dot size="16px" color={item} />
                              </li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab
                      key="type"
                      title={
                        <div className="flex items-center space-x-2">
                          <span>Type</span>
                        </div>
                      }
                    />
                    <Tab
                      key="upload"
                      title={
                        <div className="flex items-center space-x-2">
                          <span>Upload</span>
                        </div>
                      }
                    />
                    <Tab
                      key="saved"
                      title={
                        <div className="flex items-center space-x-2">
                          <span>Saved</span>
                        </div>
                      }
                    />
                  </Tabs>
                </ModalBody>
                <ModalFooter>
                    <Button variant="bordered" onPress={onClose}>
                    Close
                    </Button>
                    <Button type="submit" className="text-white" color="primary" >
                    Accept and Sign
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
      </Modal>
    </>
  );
};

export default SignatureEditModal;