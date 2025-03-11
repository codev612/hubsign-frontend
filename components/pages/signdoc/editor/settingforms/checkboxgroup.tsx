import { useEffect, useState } from "react";
import { Checkbox, Button } from "@heroui/react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

import { CheckboxGroupProps } from "@/interface/interface";

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  showCheckboxSettingForm,
  setShowCheckboxSettingForm,
  recipients,
  setCheckboxSetting,
}) => {
  useEffect(() => {
    setSelectRecipient(showCheckboxSettingForm.value.recipient);
    setCheckDefaultTick(
      showCheckboxSettingForm.value.defaultTick ? "tick" : "cross",
    );
    setCheckDefault(showCheckboxSettingForm.value.checkedBydefault);
    setCheckRequired(showCheckboxSettingForm.value.required);
  }, [showCheckboxSettingForm]);

  const [selectRecipient, setSelectRecipient] = useState<string>(
    showCheckboxSettingForm.value.recipient,
  );
  const [checkDefaultTick, setCheckDefaultTick] = useState<string>(
    showCheckboxSettingForm.value.defaultTick ? "tick" : "cross",
  );
  const [checkDefault, setCheckDefault] = useState<boolean>(
    showCheckboxSettingForm.value.checkedBydefault,
  );
  const [checkRequired, setCheckRequired] = useState<boolean>(
    showCheckboxSettingForm.value.required,
  );

  useEffect(() => {
    console.log(checkDefaultTick)
  }, [checkDefaultTick])

  return (
    <div
      className="absolute bg-white p-5 rounded-lg shadow-lg flex flex-col w-[260] gap-2 text-text"
      style={{
        left: showCheckboxSettingForm.position.left,
        top: showCheckboxSettingForm.position.top,
      }}
    >
      <select
        className="border-1 rounded-md p-2"
        value={selectRecipient}
        onChange={(e) => setSelectRecipient(e.target.value)}
      >
        {recipients.map((item) => (
          <option key={item.email} value={item.email}>
            {item.name}
          </option>
        ))}
      </select>
      <select
        className="border-1 rounded-md p-2"
        value={checkDefaultTick}
        onChange={(e) => setCheckDefaultTick(e.target.value)}
      >
        <option key="tick" value={"tick"}>{`Show as ✔ (Tick)`}</option>
        <option key="cross" value={"cross"}>{`Show as ✖ (Cross)`}</option>
      </select>
      <Checkbox
        className="text-white"
        isSelected={checkDefault}
        onValueChange={() => setCheckDefault(!checkDefault)}
      >
        Check by default
      </Checkbox>
      <div className="flex flex-row items-center justify-between">
        <Checkbox
          className="text-white"
          isSelected={checkRequired}
          onValueChange={() => setCheckRequired(!checkRequired)}
        >
          Required
        </Checkbox>
        <div className="flex flex-row">
          <Button
            isIconOnly
            className="bg-white"
            size="sm"
            startContent={<ContentCopyIcon />}
          />
          <Button
            isIconOnly
            className="bg-white"
            size="sm"
            startContent={<PostAddIcon />}
          />
          <Button
            isIconOnly
            className="bg-white"
            size="sm"
            startContent={<DeleteForeverOutlinedIcon />}
          />
        </div>
      </div>
      <div className="flex flex-row gap-1">
        <Button
          className="text-white rounded-md"
          color="primary"
          size="sm"
          onPress={() => {
            setCheckboxSetting({
              uid: showCheckboxSettingForm.uid,
              value: {
                recipient: selectRecipient,
                defaultTick: checkDefaultTick,
                defaultCheck: checkDefault,
                required: checkRequired,
              },
            });
            setShowCheckboxSettingForm({
              ...showCheckboxSettingForm,
              show: false,
            });
          }}
        >
          Apply
        </Button>
        <Button
          className="rounded-md"
          size="sm"
          onPress={() =>
            setShowCheckboxSettingForm({
              ...showCheckboxSettingForm,
              show: false,
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
