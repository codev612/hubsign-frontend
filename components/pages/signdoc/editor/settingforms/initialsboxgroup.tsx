import { useEffect, useState } from "react";
import { Checkbox, Button, Input, useDisclosure } from "@heroui/react";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { InitialsboxGroupProps } from "@/interface/interface";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PostAddIcon from '@mui/icons-material/PostAdd';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import SignatureEditModal from "../../signatureedit";

const InitialsboxGroup: React.FC<InitialsboxGroupProps> = ({ showInitialsboxSettingForm, setShowInitialsboxSettingForm, recipients, setInitialsboxSetting }) => {
  useEffect(() => {
    setSelectRecipient(showInitialsboxSettingForm.value.recipient);
    setCheckRequired(showInitialsboxSettingForm.value.required);
  }, [showInitialsboxSettingForm]);

  const [selectRecipient, setSelectRecipient] = useState<string>(showInitialsboxSettingForm.value.recipient);
  const [checkRequired, setCheckRequired] = useState<boolean>(showInitialsboxSettingForm.value.required);
  //modal for edit initials and signature
  const { isOpen:isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  
  return (
    <div
        style={{
            left: showInitialsboxSettingForm.position.left,
            top: showInitialsboxSettingForm.position.top,
        }}
        className="absolute bg-white p-5 rounded-lg shadow-lg flex flex-col w-[300] gap-2 text-text"
    >
        <SignatureEditModal 
        isOpen={isEditOpen} 
        onOpenChange={onEditOpenChange} 
        title="Initials" 
        // item={showInitialsboxSettingForm} 
        actionState={setInitialsboxSetting} 
        />
        <select value={selectRecipient} onChange={(e)=>setSelectRecipient(e.target.value)} className="border-1 rounded-md p-2">
            {
                recipients.map(item => <option key={item.email} value={item.email}>
                    {item.name}
                </option>)
            }
        </select>
        <button
        className="border-1 rounded-md p-1 hover:bg-gray-100 gap-1 flex flex-row items-center justify-center"
        onClick={()=>onEditOpen()}
        >
            <BorderColorOutlinedIcon fontSize="small" />
            Edit initials
        </button>
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
                setInitialsboxSetting({
                    uid: showInitialsboxSettingForm.uid,
                    value: {
                        recipient: selectRecipient,
                        required: checkRequired
                    }
                });
                setShowInitialsboxSettingForm({...showInitialsboxSettingForm, show:false});
            }}
            size="sm"
            >
                Apply
            </Button>
            <Button
            className="rounded-md"
            size="sm"
            onPress={() =>
                setShowInitialsboxSettingForm({...showInitialsboxSettingForm, show:false})
            }
            >
                Cancel
            </Button>
        </div>
    </div>
  );
};

export default InitialsboxGroup;
