"use client";

import React, { createContext, useContext } from "react";
import { useDisclosure } from "@heroui/react";

type ModalContextProps = {
  // for create template modal
  isCreateTemplateOpen: boolean;
  openCreateTemplate: () => void;
  closeCreateTemplate: () => void;
  onCreateTemplateOpenChange: () => void;
  // for create contact modal
  isCreateContactOpen: boolean;
  openCreateContact: () => void;
  closeCreateContact: () => void;
  onCreateContactOpenChange: () => void;
  // for contactus modal
  isContactUsOpen: boolean;
  openContactUs: () => void;
  closeContactUs: () => void;
  onContactUsOpenChange: () => void;
};

// Create Context
const ModalContext = createContext<ModalContextProps | undefined>(undefined);

// Custom Hook
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

// Global Modal Provider
export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const createTemplateModal = useDisclosure();
  const createContactModal = useDisclosure();
  const contactUsModal = useDisclosure();

  return (
    <ModalContext.Provider
      value={{
        isCreateTemplateOpen: createTemplateModal.isOpen,
        openCreateTemplate: createTemplateModal.onOpen,
        closeCreateTemplate: createTemplateModal.onClose,
        onCreateTemplateOpenChange: createTemplateModal.onOpenChange,

        isCreateContactOpen: createContactModal.isOpen,
        openCreateContact: createContactModal.onOpen,
        closeCreateContact: createContactModal.onClose,
        onCreateContactOpenChange: createContactModal.onOpenChange,

        isContactUsOpen: contactUsModal.isOpen,
        openContactUs: contactUsModal.onOpen,
        closeContactUs: contactUsModal.onClose,
        onContactUsOpenChange: contactUsModal.onOpenChange,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
