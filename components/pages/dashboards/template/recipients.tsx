import React, { useEffect, useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Recipient } from "@/interface/interface";

interface RecipientProps {
  customSigningOrder: boolean;
  contacts: Recipient[];
  user: Recipient;
  recipients: Recipient[];
  setRecipient: React.Dispatch<React.SetStateAction<Recipient[]>>;
}

const RecipientItem: React.FC<{
  recipient: Recipient;
  index: number;
  moveRecipient: (dragIndex: number, hoverIndex: number) => void;
  handleInputChange: (
    index: number,
    field: keyof Recipient,
    value: string,
  ) => void;
  handleDeleteRcpt: (index: number) => void;
  handleSelectContact: (index: number, contact: Recipient) => void;
  searchResults: Recipient[];
  searchText: string;
  setSearchText: (text: string) => void;
  setIsSearchOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  activeIndex: number | null;
  activeInputIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  setActiveInputIndex: (index: number | null) => void;
  customSigningOrder: boolean;
  isDisabled: boolean;
}> = ({
  recipient,
  index,
  moveRecipient,
  handleInputChange,
  handleDeleteRcpt,
  handleSelectContact,
  searchResults,
  searchText,
  setSearchText,
  setIsSearchOpen,
  isSearchOpen,
  activeIndex,
  activeInputIndex,
  setActiveIndex,
  setActiveInputIndex,
  customSigningOrder,
  isDisabled,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: "recipient",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveRecipient(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "recipient",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // drag(drop(ref));

  if (customSigningOrder) {
    drag(drop(ref)); // Only apply drag-and-drop when customSigningOrder is true
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "ArrowDown" &&
      activeIndex !== null &&
      activeIndex < searchResults.length - 1
    ) {
      setActiveIndex(activeIndex + 1);
    } else if (e.key === "ArrowUp" && activeIndex !== null && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else if (e.key === "Enter" && activeIndex !== null) {
      handleSelectContact(index, searchResults[activeIndex]);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement; // Type assertion to ensure it's an HTMLElement

    if (
      target &&
      !target.closest(".dropdown-container") &&
      !target.closest(".input-container")
    ) {
      setIsSearchOpen(false); // Close the dropdown if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`flex flex-row justify-between items-center w-full gap-2 p-3 bg-background rounded-md ${isDragging ? "opacity-50" : ""}`}
    >
      {customSigningOrder && (
        <DragIndicatorIcon
          style={{ cursor: "grab" }}
          onMouseDown={(e) => (e.currentTarget.style.cursor = "grabbing")}
          onMouseUp={(e) => (e.currentTarget.style.cursor = "grab")}
        />
      )}
      <div className="flex flex-row gap-1 w-full" style={{ position: "relative" }}>
        <Input
          className="bg-forecolor rounded-lg"
          placeholder="Name"
          radius="md"
          size={"sm"}
          type="text"
          value={recipient.name}
          variant="bordered"
          onChange={(e) => {
            setSearchText(e.target.value);
            handleInputChange(index, "name", e.target.value);
            handleInputChange(index, "email", e.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => {
            setActiveInputIndex(index);
            setActiveIndex(0);
            setIsSearchOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
        {isSearchOpen &&
          searchResults.length > 0 &&
          searchText.length > 0 &&
          index === activeInputIndex && (
            <div
              className="left-0 right-0 mt-1 border bg-white rounded-md shadow-md max-h-60 overflow-auto z-10"
              style={{ position: "absolute", top: "2rem" }}
            >
              {searchResults.map((contact, i) => (
                <Button
                  key={i}
                  className={`cursor-pointer p-1 hover:bg-gray-100 w-full ${activeIndex === i ? "bg-gray-200" : ""}`}
                  size="sm"
                  onPress={() => handleSelectContact(index, contact)}
                >
                  <div className="flex flex-row">
                    {contact.name}
                    {/* <p className="text-text">{`(${contact.email})`}</p> */}
                  </div>
                </Button>
              ))}
            </div>
          )}
      </div>
      <Button
        isIconOnly
        className="bg-forecolor rounded-md"
        size="sm"
        onPress={() => handleDeleteRcpt(index)}
      >
        <DeleteForeverIcon />
      </Button>
    </div>
  );
};

const Recipients: React.FC<RecipientProps> = ({
  customSigningOrder,
  contacts,
  user,
  recipients,
  setRecipient,
}) => {
  // const [recpts, setRcpts] = useState<Recipient[]>([]);
  const [searchResults, setSearchResults] = useState<Recipient[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);
  const [addedme, setAddedme] = useState<boolean>(false);

  const handleAddRcpt = () => {
    setRecipient([...recipients, { name: "", email: "" }]);
  };

  const handleInputChange = (
    index: number,
    field: keyof Recipient,
    value: string
  ) => {
    setRecipient((prevRecipients) =>
      prevRecipients.map((recipient, i) =>
        i === index ? { ...recipient, [field]: value } : recipient
      )
    );
  
    // Update search results
    const filteredContacts = contacts.filter((contact) => {
      const isInRecipients = recipients.some(
        (recipient) => recipient.email === contact.email
      );
  
      return (
        !isInRecipients &&
        (contact.email.toLowerCase().includes(value.toLowerCase()) ||
          contact.name.toLowerCase().includes(value.toLowerCase()))
      );
    });
  
    setSearchResults(filteredContacts);
  };  

  const handleDeleteRcpt = (index: number) => {
    const updatedRecipients = recipients.filter((_, i) => i !== index);

    setRecipient(updatedRecipients);
  };

  const handleSelectContact = (index: number, contact: Recipient) => {
    const updatedRecipients = [...recipients];

    updatedRecipients[index] = { name: contact.name, email: contact.email };
    setRecipient(updatedRecipients);
    setSearchResults([]);
    setSearchText("");
    setIsSearchOpen(false);
  };

  const moveRecipient = (dragIndex: number, hoverIndex: number) => {
    const updatedRecipients = [...recipients];
    const [movedRecipient] = updatedRecipients.splice(dragIndex, 1);

    updatedRecipients.splice(hoverIndex, 0, movedRecipient);
    setRecipient(updatedRecipients);
  };

  const handleAddMe = () => {
    setRecipient([...recipients, user]);
  };

  useEffect(() => {
    const isUserInRecipients = recipients.some(
      (recipient) => recipient.email === user.email,
    );

    setAddedme(isUserInRecipients);
  }, [recipients]);

  return (
    <DndProvider backend={HTML5Backend}>
      {recipients.length > 0 && recipients.map((recipient, index) => (
        <RecipientItem
          key={index}
          activeIndex={activeIndex}
          activeInputIndex={activeInputIndex}
          customSigningOrder={customSigningOrder}
          handleDeleteRcpt={handleDeleteRcpt}
          handleInputChange={handleInputChange}
          handleSelectContact={handleSelectContact}
          index={index}
          isDisabled={recipient.email === user.email ? true : false}
          isSearchOpen={isSearchOpen}
          moveRecipient={moveRecipient}
          recipient={recipient}
          searchResults={searchResults}
          searchText={searchText}
          setActiveIndex={setActiveIndex}
          setActiveInputIndex={setActiveInputIndex}
          setIsSearchOpen={setIsSearchOpen}
          setSearchText={setSearchText}
        />
      ))}

      <div className="flex flex-row gap-2">
        <Button
          radius="md"
          size="sm"
          startContent={<AddIcon />}
          variant="bordered"
          onPress={handleAddRcpt}
        >
          Add Recipient
        </Button>
      </div>
    </DndProvider>
  );
};

export default Recipients;
