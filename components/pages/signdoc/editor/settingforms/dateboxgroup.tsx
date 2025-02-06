import { useEffect, useState } from "react";
import { DropdownboxSettingFormState } from "@/interface/interface";
import { Checkbox, Button, Input, Listbox, ListboxItem } from "@heroui/react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { Recipient } from "@/interface/interface";

interface DateboxGroupProps {
  showDateboxSettingForm: DropdownboxSettingFormState;
  setShowDateboxSettingForm: React.Dispatch<React.SetStateAction<DropdownboxSettingFormState>>;
  recipients: Recipient[];
  setDateboxSetting: (payload: any) => void;
  signMode: boolean;
}

const DateboxGroup: React.FC<DateboxGroupProps> = ({ showDateboxSettingForm, setShowDateboxSettingForm, recipients, setDateboxSetting, signMode }) => {
  useEffect(() => {
    setSelectRecipient(showDateboxSettingForm.value.recipient);
    setCheckRequired(showDateboxSettingForm.value.required);
  }, [showDateboxSettingForm]);

  const [selectRecipient, setSelectRecipient] = useState<string>(showDateboxSettingForm.value.recipient);
  const [checkRequired, setCheckRequired] = useState<boolean>(showDateboxSettingForm.value.required);
  const [items, setItems] = useState<string[]>(showDateboxSettingForm.value.items);
  const [addItem, setAddItem] = useState<string>("");

  return !signMode ? (
    <div
        style={{
            left: showDateboxSettingForm.position.left,
            top: showDateboxSettingForm.position.top,
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
                setDateboxSetting({
                    uid: showDateboxSettingForm.uid,
                    value: {
                        recipient: selectRecipient,
                        items: items,
                        selectedItem: "",
                        required: checkRequired,
                    }

                });
                setShowDateboxSettingForm({...showDateboxSettingForm, show:false});
            }}
            size="sm"
            >
                Apply
            </Button>
            <Button
            className="rounded-md"
            size="sm"
            onPress={() =>
                setShowDateboxSettingForm({...showDateboxSettingForm, show:false})
            }
            >
                Cancel
            </Button>
        </div>
    </div>
  ) : (
    items.length > 0 && <div
        style={{
            left: showDateboxSettingForm.position.left,
            top: showDateboxSettingForm.position.top,
            width: showDateboxSettingForm.width,
        }}
        className="absolute bg-white p-1 rounded-lg shadow-lg flex flex-col w-[300] gap-2 text-text"
    >
        <Listbox 
            aria-label="Actions" 
            onAction={(key) => {
                setDateboxSetting({
                    uid: showDateboxSettingForm.uid,
                    value: {
                        recipient: selectRecipient,
                        items: items,
                        selectedItem: key,
                        required: checkRequired,
                    }

                });
                setShowDateboxSettingForm({...showDateboxSettingForm, show:false});
            }}
            >
            {items.map((item) => <ListboxItem key={item}>{`[${item}]`}</ListboxItem>)}
        </Listbox>
    </div>
  );
};


export default DateboxGroup;
