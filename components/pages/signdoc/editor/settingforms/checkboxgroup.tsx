import { useEffect, useState } from "react";
import { CheckboxSettingFormState } from "@/interface/interface";
import { Select, SelectItem, Checkbox, Button } from "@heroui/react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

interface CheckboxGroupProps {
  showCheckboxSettingForm: CheckboxSettingFormState;
  setShowCheckboxSettingForm: React.Dispatch<React.SetStateAction<CheckboxSettingFormState>>;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ showCheckboxSettingForm, setShowCheckboxSettingForm }) => {
  useEffect(() => {
    console.log("form", showCheckboxSettingForm);
  }, [showCheckboxSettingForm]);

  const [recipient, setRecipient] = useState<string>("Myself");
  const [defaultTick, setDefaultTick] = useState<boolean>(true);
  const [checkedBydefault, setCheckedBydefault] = useState<boolean>(true);
  const [required, setRequired] = useState<boolean>(true);

  return (
    <div
        style={{
            left: showCheckboxSettingForm.position.left,
            top: showCheckboxSettingForm.position.top,
        }}
        className="absolute bg-white p-5 rounded-lg shadow-lg flex flex-col w-[260] gap-2 text-text"
    >
        <Select defaultSelectedKeys={["dmytrozaiets66@gmail.com"]} variant="bordered">
            <SelectItem key="dmytrozaiets66@gmail.com">Myself</SelectItem>
        </Select>
        <Select variant="bordered">
            <SelectItem key="">{`Show as (Tick)`}</SelectItem>
        </Select>
        <Checkbox isSelected={checkedBydefault} className="text-white">Check by default</Checkbox>
        <div className="flex flex-row items-center justify-between">
            <Checkbox className="text-white" isSelected={required}>Required</Checkbox>
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
            onPress={() =>
            setShowCheckboxSettingForm({
                show: false,
                position: { left: 0, top: 0 },
                value: {
                recipient: "",
                defaultTick: true,
                checkedBydefault: true,
                required: true,
                },
            })
            }
            size="sm"
            >
                Apply
            </Button>
            <Button
            className="rounded-md"
            size="sm"
            onPress={() =>
            setShowCheckboxSettingForm({
                show: false,
                position: { left: 0, top: 0 },
                value: {
                recipient: "",
                defaultTick: true,
                checkedBydefault: true,
                required: true,
                },
            })
            }
            >
                Cancel
            </Button>
        </div>
    </div>
  );
};

export default CheckboxGroup;
