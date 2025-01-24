import { useEffect, useState } from "react";
import { TextboxSettingFormState } from "@/interface/interface";
import { Checkbox, Button, Input } from "@heroui/react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { Recipient } from "@/interface/interface";
import { Switch } from "@heroui/react";

interface TextboxGroupProps {
  showTextboxSettingForm: TextboxSettingFormState;
  setShowTextboxSettingForm: React.Dispatch<React.SetStateAction<TextboxSettingFormState>>;
  recipients: Recipient[];
  setTextboxSetting: (payload: any) => void;
}

const TextboxGroup: React.FC<TextboxGroupProps> = ({ showTextboxSettingForm, setShowTextboxSettingForm, recipients, setTextboxSetting }) => {
  useEffect(() => {
    setSelectRecipient(showTextboxSettingForm.value.recipient);
    setCustomPlaceholder(showTextboxSettingForm.value.customPlaceholder);
    setPlaceholder(showTextboxSettingForm.value.placeholder);
    setCheckRequired(showTextboxSettingForm.value.required);
  }, [showTextboxSettingForm]);

  const [selectRecipient, setSelectRecipient] = useState<string>(showTextboxSettingForm.value.recipient);
  const [customPlaceholder, setCustomPlaceholder] = useState<boolean>(showTextboxSettingForm.value.customPlaceholder);
  const [placeholder, setPlaceholder] = useState<string>(showTextboxSettingForm.value.placeholder);
  const [checkRequired, setCheckRequired] = useState<boolean>(showTextboxSettingForm.value.required);

  return (
    <div
        style={{
            left: showTextboxSettingForm.position.left,
            top: showTextboxSettingForm.position.top,
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
        <Switch 
        isSelected={customPlaceholder} 
        onValueChange={setCustomPlaceholder}
        >
            Edit the placeholder text
        </Switch>
        {customPlaceholder && <Input variant="bordered" placeholder={`By default "Enter value"`} value={placeholder} onValueChange={setPlaceholder} />}
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
                setTextboxSetting({
                    uid: showTextboxSettingForm.uid,
                    value: {
                        recipient: selectRecipient,
                        customPlaceholder: customPlaceholder,
                        placeholder: placeholder,
                        required: checkRequired
                    }
                });
                setShowTextboxSettingForm({...showTextboxSettingForm, show:false});
            }}
            size="sm"
            >
                Apply
            </Button>
            <Button
            className="rounded-md"
            size="sm"
            onPress={() =>
                setShowTextboxSettingForm({...showTextboxSettingForm, show:false})
            }
            >
                Cancel
            </Button>
        </div>
    </div>
  );
};

export default TextboxGroup;
