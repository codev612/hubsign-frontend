import { useEffect, useState } from "react";
import { DropdownboxSettingFormState } from "@/interface/interface";
import { Checkbox, Button, Input, Listbox, ListboxItem } from "@heroui/react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { DateboxGroupProps } from "@/interface/interface";
import Calendar from "@/components/common/calendar";

const DateboxGroup: React.FC<DateboxGroupProps> = ({ showDateboxSettingForm, setShowDateboxSettingForm, recipients, setDateboxSetting, signMode }) => {
  useEffect(() => {
    setSelectRecipient(showDateboxSettingForm.value.recipient);
    setCheckRequired(showDateboxSettingForm.value.required);
    setDateFormat(showDateboxSettingForm.value.format);
    setLockedToday(showDateboxSettingForm.value.lockedToday);
  }, [showDateboxSettingForm]);

  const [selectRecipient, setSelectRecipient] = useState<string>(showDateboxSettingForm.value.recipient);
  const [checkRequired, setCheckRequired] = useState<boolean>(showDateboxSettingForm.value.required);
  const [dateFormat, setDateFormat] = useState<string>(showDateboxSettingForm.value.format);
  const [lockedToday, setLockedToday] = useState<boolean>(showDateboxSettingForm.value.lockedToday);

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
        <select value={dateFormat} onChange={(e)=>setDateFormat(e.target.value)} className="border-1 rounded-md p-2">
            <option value="mm/dd/yyyy">MM/DD/YYYY</option>
            <option value="dd/mm/yyyy">DD/MM/YYYY</option>
            <option value="yyyy/mm/dd">YYYY/MM/DD</option>
        </select>
        <Checkbox className="text-white" isSelected={lockedToday} onValueChange={()=>setLockedToday(!lockedToday)}>Lock to the date of signing</Checkbox>
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
                        format: dateFormat,
                        required: checkRequired,
                        lockedToday: lockedToday,
                    }

                });
                setShowDateboxSettingForm({...showDateboxSettingForm, show: false});
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
    <div
        style={{
            left: showDateboxSettingForm.position.left,
            top: showDateboxSettingForm.position.top,
        }}
        className="absolute bg-white rounded-lg flex flex-col w-[300px] text-text"
    >
        <Calendar />
    </div>

  );
};



export default DateboxGroup;
