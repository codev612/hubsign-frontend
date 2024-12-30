import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const contacts = [
    {
        name:"dmytro",
        email: "dmytrozaets66@gmail.com"
    },
    {
        name:"Damon",
        email:"codeveloper612@gmail.com"
    },
    {
        name:"brian",
        email:"amadyba865@gmail.com"
    }
]

interface Recipient {
    name: string;
    email: string;
}

const Recipients = () => {

    const [recpts, setRcpts] = useState<Recipient[]>([]);

    const handleAddRcpt = () => {
        setRcpts([...recpts, {
            name: "",
            email: ""
        }])
    }

    const handleInputChange = (index: number, field: keyof Recipient, value: string) => {
        const updatedRecipients = [...recpts];
        updatedRecipients[index] = { ...updatedRecipients[index], [field]: value };
        setRcpts(updatedRecipients);
    };

    const handleDeleteRcpt = (index: number) => {
        const updatedRecipients = recpts.filter((_, i) => i !== index);
        setRcpts(updatedRecipients);
    };

    const handleAddMe = () => {

    }

    useEffect(()=>{
        console.log(recpts)
    }, [recpts])

    return(
        <>
            {recpts.length ? recpts.map(( item, index )=><div key={index} className="flex flex-row justify-between items-center w-full gap-2 p-3 bg-background rounded-md">
                <DragIndicatorIcon />
                <Input 
                className="bg-forecolor rounded-lg" 
                placeholder="Email Adress" 
                size={"sm"} type="email" 
                variant="bordered" 
                radius="md"
                isRequired
                value={item.email}
                onChange={(e) => handleInputChange(index, 'email', e.target.value)}
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
                />
                <Button
                className="bg-forecolor rounded-md"
                isIconOnly 
                size="sm"
                onClick={() => handleDeleteRcpt(index)}
                >
                    <DeleteForeverIcon />
                </Button>
            </div>) : ""}
            <div className="flex flex-row gap-2">
                <Button size="sm" variant="bordered" radius="md" startContent={<AddIcon />} onClick={handleAddRcpt}>Add Recipient</Button>
                <Button size="sm" variant="bordered" radius="md" startContent={<AccountCircleIcon />} onClick={handleAddMe}>Add Myself</Button>
            </div>
        </>
        
    )
}

export default Recipients;