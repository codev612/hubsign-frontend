import { useEffect, useState } from "react";
import { RadioboxSettingFormState } from "@/interface/interface";
import { Select, SelectItem, Checkbox, Button } from "@heroui/react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { RadioboxGroupProps } from "@/interface/interface";

const RadioboxGroup: React.FC<RadioboxGroupProps> = ({ showRadioboxSettingForm, setShowRadioboxSettingForm, recipients, setRadioboxSetting }) => {
  useEffect(() => {
    setSelectRecipient(showRadioboxSettingForm.value.recipient);
    setCheckRequired(showRadioboxSettingForm.value.required);
  }, [showRadioboxSettingForm]);

  const [selectRecipient, setSelectRecipient] = useState<string>(showRadioboxSettingForm.value.recipient);
  const [checkRequired, setCheckRequired] = useState<boolean>(showRadioboxSettingForm.value.required);

  return (
    <div
        style={{
            left: showRadioboxSettingForm.position.left,
            top: showRadioboxSettingForm.position.top,
        }}
        className="absolute bg-white p-5 rounded-lg shadow-lg flex flex-col w-[260] gap-2 text-text"
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
                setRadioboxSetting({
                    uid: showRadioboxSettingForm.uid,
                    value: {
                        recipient: selectRecipient,
                        required: checkRequired
                    }
                });
                setShowRadioboxSettingForm({...showRadioboxSettingForm, show:false});
            }}
            size="sm"
            >
                Apply
            </Button>
            <Button
            className="rounded-md"
            size="sm"
            onPress={() =>
                setShowRadioboxSettingForm({...showRadioboxSettingForm, show:false})
            }
            >
                Cancel
            </Button>
        </div>
    </div>
  );
};

export default RadioboxGroup;
