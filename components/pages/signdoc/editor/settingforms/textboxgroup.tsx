import { useEffect, useState } from "react";
import { Checkbox, Button, Input } from "@heroui/react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { Switch } from "@heroui/react";

import { TextboxGroupProps } from "@/interface/interface";

const TextboxGroup: React.FC<TextboxGroupProps> = ({
  showTextboxSettingForm,
  setShowTextboxSettingForm,
  recipients,
  setTextboxSetting,
}) => {
  useEffect(() => {
    setSelectRecipient(showTextboxSettingForm.value.recipient);
    setCustomPlaceholder(showTextboxSettingForm.value.customPlaceholder);
    setPlaceholder(showTextboxSettingForm.value.placeholder);
    setCheckRequired(showTextboxSettingForm.value.required);
  }, [showTextboxSettingForm]);

  const [selectRecipient, setSelectRecipient] = useState<string>(
    showTextboxSettingForm.value.recipient,
  );
  const [customPlaceholder, setCustomPlaceholder] = useState<boolean>(
    showTextboxSettingForm.value.customPlaceholder,
  );
  const [placeholder, setPlaceholder] = useState<string>(
    showTextboxSettingForm.value.placeholder,
  );
  const [checkRequired, setCheckRequired] = useState<boolean>(
    showTextboxSettingForm.value.required,
  );

  return (
    <div
      className="absolute bg-white p-5 rounded-lg shadow-lg flex flex-col w-[300] gap-2 text-text"
      style={{
        left: showTextboxSettingForm.position.left,
        top: showTextboxSettingForm.position.top,
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
      <Switch
        isSelected={customPlaceholder}
        onValueChange={setCustomPlaceholder}
      >
        Edit the placeholder text
      </Switch>
      {customPlaceholder && (
        <Input
          placeholder={`By default "Enter value"`}
          value={placeholder}
          variant="bordered"
          onValueChange={setPlaceholder}
        />
      )}
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
            setTextboxSetting({
              uid: showTextboxSettingForm.uid,
              value: {
                recipient: selectRecipient,
                customPlaceholder: customPlaceholder,
                placeholder: placeholder,
                required: checkRequired,
              },
            });
            setShowTextboxSettingForm({
              ...showTextboxSettingForm,
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
            setShowTextboxSettingForm({
              ...showTextboxSettingForm,
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

export default TextboxGroup;
