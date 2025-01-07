import React, { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface Recipient {
    name: string;
    email: string;
}

interface RecipientProps {
    customSigningOrder: boolean;
    contacts: Recipient[];
    user: Recipient;
}

const RecipientItem: React.FC<{
    recipient: Recipient;
    index: number;
    moveRecipient: (dragIndex: number, hoverIndex: number) => void;
    handleInputChange: (index: number, field: keyof Recipient, value: string) => void;
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
        if (e.key === "ArrowDown" && activeIndex !== null && activeIndex < searchResults.length - 1) {
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
            !target.closest('.dropdown-container') &&
            !target.closest('.input-container')
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
            {customSigningOrder && <DragIndicatorIcon 
                style={{ cursor: "grab" }}
                onMouseDown={(e) => (e.currentTarget.style.cursor = "grabbing")}
                onMouseUp={(e) => (e.currentTarget.style.cursor = "grab")}
            />}
            <div className="flex flex-row gap-1" style={{ position: "relative" }}>
                <Input
                    className="bg-forecolor rounded-lg"
                    placeholder="Email Address"
                    size={"sm"}
                    type="email"
                    variant="bordered"
                    radius="md"
                    value={recipient.email}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        handleInputChange(index, "email", e.target.value);
                        setIsSearchOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        setActiveInputIndex(index)
                        setActiveIndex(0);
                        setIsSearchOpen(true);
                    }}
                    isDisabled={isDisabled}
                />
                <Input
                    className="bg-forecolor rounded-lg"
                    placeholder="Name"
                    size={"sm"}
                    type="text"
                    variant="bordered"
                    radius="md"
                    value={recipient.name}
                    onChange={(e) => handleInputChange(index, "name", e.target.value)}
                />
                {isSearchOpen && searchResults.length > 0 && searchText.length > 0 && (index===activeInputIndex) && (
                    <div
                        className="left-0 right-0 mt-1 border bg-white rounded-md shadow-md max-h-60 overflow-auto z-10"
                        style={{ position: "absolute", top: "2rem" }}
                    >
                        {searchResults.map((contact, i) => (
                            <Button
                                size="sm"
                                key={i}
                                className={`cursor-pointer p-1 hover:bg-gray-100 w-full ${activeIndex === i ? "bg-gray-200" : ""}`}
                                onClick={() => handleSelectContact(index, contact)}
                            >
                                <div className="flex flex-row">
                                    {contact.name}
                                    <p className="text-text">{`(${contact.email})`}</p>
                                </div>
                            </Button>
                        ))}
                    </div>
                )}
            </div>
            <Button
                className="bg-forecolor rounded-md"
                isIconOnly
                size="sm"
                onClick={() => handleDeleteRcpt(index)}
            >
                <DeleteForeverIcon />
            </Button>
        </div>
    );
};

const Recipients: React.FC<RecipientProps> = ({ customSigningOrder, contacts, user }) => {
    const [recpts, setRcpts] = useState<Recipient[]>([]);
    const [searchResults, setSearchResults] = useState<Recipient[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);
    const [addedme, setAddedme] = useState<boolean>(false);

    const handleAddRcpt = () => {
        setRcpts([...recpts, { name: "", email: "" }]);
    };

    const handleInputChange = (index: number, field: keyof Recipient, value: string) => {
        const updatedRecipients = [...recpts];
        updatedRecipients[index] = { ...updatedRecipients[index], [field]: value };
        setRcpts(updatedRecipients);

        // Update search results
        const filteredContacts = contacts.filter((contact) =>
            contact.email.toLowerCase().includes(value.toLowerCase()) ||
            contact.name.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(filteredContacts);
    };

    const handleDeleteRcpt = (index: number) => {
        const updatedRecipients = recpts.filter((_, i) => i !== index);
        setRcpts(updatedRecipients);
    };

    const handleSelectContact = (index: number, contact: Recipient) => {
        const updatedRecipients = [...recpts];
        updatedRecipients[index] = { name: contact.name, email: contact.email };
        setRcpts(updatedRecipients);
        setSearchResults([]);
        setSearchText("");
        setIsSearchOpen(false);
    };

    const moveRecipient = (dragIndex: number, hoverIndex: number) => {
        const updatedRecipients = [...recpts];
        const [movedRecipient] = updatedRecipients.splice(dragIndex, 1);
        updatedRecipients.splice(hoverIndex, 0, movedRecipient);
        setRcpts(updatedRecipients);
    };

    const handleAddMe = () => {
        setRcpts([...recpts, user]);
    };

    useEffect(() => {
        const isUserInRecipients = recpts.some(
            (recipient) => recipient.email === user.email
        );
        setAddedme(isUserInRecipients);
    }, [recpts]);

    return (
        <DndProvider backend={HTML5Backend}>
            {recpts.map((recipient, index) => (
                <RecipientItem
                    key={index}
                    recipient={recipient}
                    index={index}
                    moveRecipient={moveRecipient}
                    handleInputChange={handleInputChange}
                    handleDeleteRcpt={handleDeleteRcpt}
                    handleSelectContact={handleSelectContact}
                    searchResults={searchResults}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    setIsSearchOpen={setIsSearchOpen}
                    isSearchOpen={isSearchOpen}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    customSigningOrder={customSigningOrder}
                    activeInputIndex={activeInputIndex}
                    setActiveInputIndex={setActiveInputIndex}
                    isDisabled={recipient.email===user.email?true:false}
                />
            ))}

            <div className="flex flex-row gap-2">
                <Button
                    size="sm"
                    variant="bordered"
                    radius="md"
                    startContent={<AddIcon />}
                    onClick={handleAddRcpt}
                >
                    Add Recipient
                </Button>
                <Button
                    size="sm"
                    variant="bordered"
                    radius="md"
                    startContent={<AccountCircleIcon />}
                    onClick={handleAddMe}
                    isDisabled={addedme}
                >
                    Add Myself
                </Button>
            </div>
        </DndProvider>
    );
};

export default Recipients;
