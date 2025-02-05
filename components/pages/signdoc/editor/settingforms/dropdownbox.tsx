import { useEffect, useState } from "react";
import { DropdownboxSettingFormState } from "@/interface/interface";
import { Checkbox, Button, Input } from "@heroui/react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { Recipient } from "@/interface/interface";

interface DropdownboxGroupProps {
  showDropdownboxSettingForm: DropdownboxSettingFormState;
  setShowDropdownboxSettingForm: React.Dispatch<React.SetStateAction<DropdownboxSettingFormState>>;
  recipients: Recipient[];
  setDropdownboxSetting: (payload: any) => void;
}

const DropdownboxGroup: React.FC<DropdownboxGroupProps> = ({ showDropdownboxSettingForm, setShowDropdownboxSettingForm, recipients, setDropdownboxSetting }) => {
  useEffect(() => {
    setSelectRecipient(showDropdownboxSettingForm.value.recipient);
    setCheckRequired(showDropdownboxSettingForm.value.required);
  }, [showDropdownboxSettingForm]);

  const [selectRecipient, setSelectRecipient] = useState<string>(showDropdownboxSettingForm.value.recipient);
  const [checkRequired, setCheckRequired] = useState<boolean>(showDropdownboxSettingForm.value.required);
  const [items, setItems] = useState<string[]>(showDropdownboxSettingForm.value.items);
  const [addItem, setAddItem] = useState<string>("");

  return (
    <div
        style={{
            left: showDropdownboxSettingForm.position.left,
            top: showDropdownboxSettingForm.position.top,
        }}
        className="absolute bg-white p-5 rounded-lg shadow-lg flex flex-col w-[300] gap-2 text-text"
    >
        <select value={selectRecipient} onChange={(e)=>setSelectRecipient(e.target.value)} className="border-1 rounded-md p-2">
            {
                recipients.map(item => <option key={item.email} value={item.email}>
                    {item.name}
                </option>)
            }
        </select>
        <div className="flex flex-col gap-1">
            <p>Dropdown Items</p>   

            {items.map((item,index) =>
                <div className="flex flex-row justify-between" key={index}>
                    <input 
                    type="text"
                    placeholder="Item value"
                    className="border-1 rounded-md p-1"       
                    value={item}
                    onChange={(e)=>setItems(items.map((item, i) => i === index ? e.target.value : item))}
                    />
                    <button
                    className="border-1 rounded-md w-[33]"
                    onClick={()=>setItems(items.filter((_, i) => i !== index))}
                    ><RemoveOutlinedIcon /></button>
                </div>

            )}
            <div className="flex flex-row justify-between">
                <input 
                type="text"
                placeholder="Item value"
                className="border-1 rounded-md p-1"       
                value={addItem}
                onChange={(e)=>setAddItem(e.target.value)}     
                />
                <button
                className="border-1 rounded-md w-[33]"
                onClick={()=>{
                    if( addItem !== "") {
                        setItems([...items, addItem]); 
                        setAddItem(""); 
                    }
                }}
                ><AddOutlinedIcon /></button>
            </div>
        </div>
         <div className="flex flex-row items-center justify-between">
            <Checkbox className="text-white" isSelected={checkRequired} onValueChange={()=>setCheckRequired(!checkRequired)}>Required</Checkbox>
            <div className="flex flex-row">
                <Button isIconOnly startContent={<ContentCopyIcon />} size="sm" className="bg-white" />
                <Button isIconOnly startContent={<PostAddIcon />} size="sm" className="bg-white" />
                <Button isIconOnly startContent={<DeleteForeverOutlinedIcon />} size="sm" className="bg-white" />
            </div>
        </div>
        <div className="flex flex-row gap-1">
            <Button
            className="text-white rounded-md"
            color="primary"
            onPress={() => {
                setDropdownboxSetting({
                    uid: showDropdownboxSettingForm.uid,
                    value: {
                        recipient: selectRecipient,
                        items: items,
                        required: checkRequired,
                    }
                });
                setShowDropdownboxSettingForm({...showDropdownboxSettingForm, show:false});
            }}
            size="sm"
            >
                Apply
            </Button>
            <Button
            className="rounded-md"
            size="sm"
            onPress={() =>
                setShowDropdownboxSettingForm({...showDropdownboxSettingForm, show:false})
            }
            >
                Cancel
            </Button>
        </div>
    </div>
  );
};

export default DropdownboxGroup;
