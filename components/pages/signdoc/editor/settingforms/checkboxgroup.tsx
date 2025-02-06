import { useEffect, useState } from "react";
import { CheckboxSettingFormState } from "@/interface/interface";
import { Select, SelectItem, Checkbox, Button } from "@heroui/react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { CheckboxGroupProps } from "@/interface/interface";

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ showCheckboxSettingForm, setShowCheckboxSettingForm, recipients, setCheckboxSetting }) => {
  useEffect(() => {
    setSelectRecipient(showCheckboxSettingForm.value.recipient);
    setCheckDefaultTick(showCheckboxSettingForm.value.defaultTick?"tick":"cross");
    setCheckDefault(showCheckboxSettingForm.value.checkedBydefault);
    setCheckRequired(showCheckboxSettingForm.value.required);
  }, [showCheckboxSettingForm]);

  const [selectRecipient, setSelectRecipient] = useState<string>(showCheckboxSettingForm.value.recipient);
  const [checkDefaultTick, setCheckDefaultTick] = useState<string>(showCheckboxSettingForm.value.defaultTick?"tick":"cross");
  const [checkDefault, setCheckDefault] = useState<boolean>(showCheckboxSettingForm.value.checkedBydefault);
  const [checkRequired, setCheckRequired] = useState<boolean>(showCheckboxSettingForm.value.required);

  return (
    <div
        style={{
            left: showCheckboxSettingForm.position.left,
            top: showCheckboxSettingForm.position.top,
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
        <select className="border-1 rounded-md p-2" value={checkDefaultTick} onChange={(e)=>setCheckDefaultTick(e.target.value)}>
            <option key="tick">{`Show as ✔ (Tick)`}</option>
            <option key="cross">{`Show as ✖ (Cross)`}</option>
        </select>
        <Checkbox isSelected={checkDefault} className="text-white" onValueChange={()=>setCheckDefault(!checkDefault)}>Check by default</Checkbox>
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
                setCheckboxSetting({
                    uid: showCheckboxSettingForm.uid,
                    value: {
                        recipient: selectRecipient,
                        defaultTick: checkDefaultTick,
                        defaultCheck: checkDefault,
                        required: checkRequired
                    }
                });
                setShowCheckboxSettingForm({...showCheckboxSettingForm, show:false});
            }}
            size="sm"
            >
                Apply
            </Button>
            <Button
            className="rounded-md"
            size="sm"
            onPress={() =>
                setShowCheckboxSettingForm({...showCheckboxSettingForm, show:false})
            }
            >
                Cancel
            </Button>
        </div>
    </div>
  );
};

export default CheckboxGroup;
