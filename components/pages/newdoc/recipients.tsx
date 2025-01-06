import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// const contacts = [
//     { name: "dmytro", email: "dmytrozaets66@gmail.com" },
//     { name: "Damon", email: "codeveloper612@gmail.com" },
//     { name: "brian", email: "amadyba865@gmail.com" }
// ];

interface Recipient {
    name: string;
    email: string;
}

interface RecipientProps {
    customSigningOrder:boolean;
    contacts: Recipient[];
    user: Recipient;
}

const Recipients:React.FC<RecipientProps> = ({customSigningOrder, contacts, user}) => {
    const [recpts, setRcpts] = useState<Recipient[]>([]);
    const [searchResults, setSearchResults] = useState<Recipient[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [searchText, setSearchText] = useState<string>("");
    const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const [addedme, setAddedme] = useState<boolean>(false);

    const handleAddRcpt = () => {
        setRcpts([...recpts, { name: "", email: "" }]);
    };

    const handleInputChange = (index: number, field: keyof Recipient, value: string) => {
        const updatedRecipients = [...recpts];
        updatedRecipients[index] = { ...updatedRecipients[index], [field]: value };
        setRcpts(updatedRecipients);
        // Set the search text for use in filtering
        setSearchText(value);

        // Search for matching contacts when the input text changes
        const filteredContacts = contacts.filter(contact =>
            contact.email.toLowerCase().includes(value.toLowerCase()) ||
            contact.name.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(filteredContacts);
        setIsSearchOpen(true);
    };

    const handleDeleteRcpt = (index: number) => {
        const updatedRecipients = recpts.filter((_, i) => i !== index);
        setRcpts(updatedRecipients);
    };

    const handleSelectContact = (index: number, contact: Recipient) => {
        const updatedRecipients = [...recpts];
        updatedRecipients[activeInputIndex || 0] = { name: contact.name, email: contact.email };
        setRcpts(updatedRecipients);
        setSearchResults([]);
        setSearchText(contact.email);
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "ArrowDown" && activeIndex !== null && activeIndex < searchResults.length - 1) {
            setActiveIndex(activeIndex + 1); // Move down the dropdown list
        } else if (e.key === "ArrowUp" && activeIndex !== null && activeIndex > 0) {
            setActiveIndex(activeIndex - 1); // Move up the dropdown list
        } else if (e.key === "Enter" && activeIndex !== null) {
            handleSelectContact(index, searchResults[activeIndex]); // Select active contact on Enter key
        }
    };

    const handleAddMe = () => {
        setRcpts([...recpts, user]);
    };

    // Close the search results when clicking outside the dropdown
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

    useEffect(() => {
        console.log(recpts);
        const isUserInRecipients = recpts.some(
            (recipient) => recipient.email === user.email
        );

        isUserInRecipients ? setAddedme(true) : setAddedme(false);
    }, [recpts]);

    return (
        <>
            {recpts.length ? recpts.map((item, index) => (
                <div key={index} className="flex flex-row justify-between items-center w-full gap-2 p-3 bg-background rounded-md">
                    {customSigningOrder&&<DragIndicatorIcon />}
                    <div className="flex flex-row gap-1" style={{position:"relative"}}>
                        <Input
                            className="bg-forecolor rounded-lg"
                            placeholder="Email Address"
                            size={"sm"} type="email"
                            variant="bordered"
                            radius="md"
                            isRequired
                            value={item.email}
                            onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, index)} // Handle keyboard navigation
                            onFocus={()=>{setActiveInputIndex(index);setActiveIndex(0);}}
                        />
                        <Input
                            className="bg-forecolor rounded-lg"
                            placeholder="Name"
                            size={"sm"}
                            type="text"
                            variant="bordered"
                            radius="md"
                            isRequired
                            value={item.name}
                            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, index)} // Handle keyboard navigation
                            onFocus={()=>{setActiveInputIndex(index);setActiveIndex(0)}}
                        />
                        {/* Dropdown container for each input */}
                        {isSearchOpen && searchResults.length > 0 && searchText.length > 0 && (activeInputIndex===index) && (
                            <div
                                className="left-0 right-0 mt-1 border bg-white rounded-md shadow-md max-h-60 overflow-auto z-10"
                                style={{ position:"absolute", top:"2rem"}} // Place the dropdown just below the input
                            >
                                {searchResults.map((contact, i) => (
                                    <button
                                        key={i}
                                        className={`cursor-pointer p-1 hover:bg-gray-100 w-full ${activeIndex === i ? "bg-gray-200" : ""}`}
                                        onClick={() => handleSelectContact(index, contact)} // Update specific recipient
                                        onMouseOut={()=>setActiveIndex(-1)}
                                    >
                                        <div className="flex flex-row">{contact.name}<p className="text-text">{`(${contact.email})`}</p></div>
                                    </button>
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
            )) : ""}

            <div className="flex flex-row gap-2">
                <Button size="sm" variant="bordered" radius="md" startContent={<AddIcon />} 
                onClick={handleAddRcpt}
                >Add Recipient</Button>
                <Button size="sm" variant="bordered" radius="md" startContent={<AccountCircleIcon />} 
                onClick={handleAddMe}
                // disabled={addedme}
                isDisabled={addedme}
                >Add Myself</Button>
            </div>
        </>
    );
};

export default Recipients;
