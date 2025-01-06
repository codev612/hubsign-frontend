import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const contacts = [
    { name: "dmytro", email: "dmytrozaets66@gmail.com" },
    { name: "Damon", email: "codeveloper612@gmail.com" },
    { name: "brian", email: "amadyba865@gmail.com" }
];

interface Recipient {
    name: string;
    email: string;
}

const Recipients = () => {
    const [recpts, setRcpts] = useState<Recipient[]>([]);
    const [searchResults, setSearchResults] = useState<Recipient[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [searchText, setSearchText] = useState<string>("");
    const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);

    const handleAddRcpt = () => {
        setRcpts([...recpts, { name: "", email: "" }]);
    };

    const handleInputChange = (index: number, field: keyof Recipient, value: string) => {
        console.log(index)
        const updatedRecipients = [...recpts];
        updatedRecipients[index] = { ...updatedRecipients[index], [field]: value };
        setRcpts(updatedRecipients);
        setActiveIndex(index);
        // Set the search text for use in filtering
        setSearchText(value);

        // Search for matching contacts when the input text changes
        const filteredContacts = contacts.filter(contact =>
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
        console.log('select:', index)
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

    const handleAddMe = () => { };

    useEffect(() => {
        console.log(recpts);
    }, [recpts]);

    return (
        <>
            {recpts.length ? recpts.map((item, index) => (
                <div key={index} className="flex flex-row justify-between items-center w-full gap-2 p-3 bg-background rounded-md">
                    <DragIndicatorIcon />
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
                            onFocus={()=>setActiveInputIndex(index)}
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
                            onFocus={()=>setActiveInputIndex(index)}
                        />
                        {/* Dropdown container for each input */}
                        {searchResults.length > 0 && searchText.length > 0 && (activeInputIndex===index) && (
                            <div
                                className="left-0 right-0 mt-1 border bg-white rounded-md shadow-md max-h-60 overflow-auto z-10"
                                style={{ position:"absolute", top:"2rem"}} // Place the dropdown just below the input
                            >
                                {searchResults.map((contact, i) => (
                                    <div
                                        key={i}
                                        className={`cursor-pointer p-2 hover:bg-gray-100 ${activeIndex === i ? "bg-gray-200" : ""}`}
                                        onClick={() => handleSelectContact(index, contact)} // Update specific recipient
                                    >
                                        <div>{`${contact.name}(${contact.email})`}</div>
                                    </div>
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
                <Button size="sm" variant="bordered" radius="md" startContent={<AddIcon />} onClick={handleAddRcpt}>Add Recipient</Button>
                <Button size="sm" variant="bordered" radius="md" startContent={<AccountCircleIcon />} onClick={handleAddMe}>Add Myself</Button>
            </div>
        </>
    );
};

export default Recipients;
