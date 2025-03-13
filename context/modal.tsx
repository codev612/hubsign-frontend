"use client";

import React, { createContext, useContext } from "react";
import { useDisclosure } from "@heroui/react";

type ModalContextProps = {
  // Modal states and handlers
  isCreateTemplateOpen: boolean;
  openCreateTemplate: () => void;
  closeCreateTemplate: () => void;
  onCreateTemplateOpenChange: () => void;
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

  return (
    <ModalContext.Provider
      value={{
        isCreateTemplateOpen: createTemplateModal.isOpen,
        openCreateTemplate: createTemplateModal.onOpen,
        closeCreateTemplate: createTemplateModal.onClose,
        onCreateTemplateOpenChange: createTemplateModal.onOpenChange,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
