import { useEffect, useState } from "react";
import { Checkbox, Button } from "@heroui/react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

import { RadioboxGroupProps } from "@/interface/interface";

const RadioboxGroup: React.FC<RadioboxGroupProps> = ({
  showRadioboxSettingForm,
  setShowRadioboxSettingForm,
  recipients,
  setRadioboxSetting,
}) => {
  useEffect(() => {
    setSelectRecipient(showRadioboxSettingForm.value.recipient);
    setCheckRequired(showRadioboxSettingForm.value.required);
  }, [showRadioboxSettingForm]);

  const [selectRecipient, setSelectRecipient] = useState<string>(
    showRadioboxSettingForm.value.recipient,
  );
  const [checkRequired, setCheckRequired] = useState<boolean>(
    showRadioboxSettingForm.value.required,
  );

  return (
    <div
      className="absolute bg-white p-5 rounded-lg shadow-lg flex flex-col w-[260] gap-2 text-text"
      style={{
        left: showRadioboxSettingForm.position.left,
        top: showRadioboxSettingForm.position.top,
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
            setRadioboxSetting({
              uid: showRadioboxSettingForm.uid,
              value: {
                recipient: selectRecipient,
                required: checkRequired,
              },
            });
            setShowRadioboxSettingForm({
              ...showRadioboxSettingForm,
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
            setShowRadioboxSettingForm({
              ...showRadioboxSettingForm,
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

export default RadioboxGroup;
