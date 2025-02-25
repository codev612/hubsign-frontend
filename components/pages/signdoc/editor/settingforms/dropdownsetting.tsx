import { useEffect, useState } from "react";
import { Checkbox, Button } from "@heroui/react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";

import { DropdownboxGroupProps } from "@/interface/interface";

const DropdownboxSetting: React.FC<DropdownboxGroupProps> = ({
  showDropdownboxSettingForm,
  setShowDropdownboxSettingForm,
  recipients,
  setDropdownboxSetting,
  signMode,
}) => {
  useEffect(() => {
    setSelectRecipient(showDropdownboxSettingForm.value.recipient);
    setCheckRequired(showDropdownboxSettingForm.value.required);
  }, [showDropdownboxSettingForm]);

  const [selectRecipient, setSelectRecipient] = useState<string>(
    showDropdownboxSettingForm.value.recipient,
  );
  const [checkRequired, setCheckRequired] = useState<boolean>(
    showDropdownboxSettingForm.value.required,
  );
  const [items, setItems] = useState<string[]>(
    showDropdownboxSettingForm.value.items,
  );
  const [addItem, setAddItem] = useState<string>("");

  const handleAddItem = () => {
    if (!items.includes(addItem)) {
      setItems((prevItems) => (addItem ? [...prevItems, addItem] : prevItems));
      setAddItem("");
    }
  };

  return (
    <div
      className="absolute bg-white p-5 rounded-lg shadow-lg flex flex-col w-[300] gap-2 text-text"
      style={{
        left: showDropdownboxSettingForm.position.left,
        top: showDropdownboxSettingForm.position.top,
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
      <div className="flex flex-col gap-1">
        <p>Dropdown Items</p>
        {items.map((item, index) => (
          <div key={index} className="flex flex-row justify-between">
            <input
              className="border-1 rounded-md p-1"
              placeholder="Item value"
              type="text"
              value={`[${item}]`} // Just use the `item` value directly
              onChange={(e) => {
                const newValue = e.target.value.replace(/[\[\]]/g, ""); // Remove brackets

                setItems(
                  items.map((item, i) => (i === index ? newValue : item)),
                );
              }}
            />
            <button
              className="border-1 rounded-md w-[33]"
              onClick={() => setItems(items.filter((_, i) => i !== index))}
            >
              <RemoveOutlinedIcon />
            </button>
          </div>
        ))}
        <div className="flex flex-row justify-between">
          <input
            className="border-1 rounded-md p-1"
            placeholder="Item value"
            type="text"
            value={addItem}
            onChange={(e) => setAddItem(e.target.value)}
          />
          <button
            className="border-1 rounded-md w-[33]"
            onClick={() => handleAddItem()}
          >
            <AddOutlinedIcon />
          </button>
        </div>
      </div>
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
            setDropdownboxSetting({
              uid: showDropdownboxSettingForm.uid,
              value: {
                recipient: selectRecipient,
                items: items,
                selectedItem: "",
                required: checkRequired,
              },
            });
            setShowDropdownboxSettingForm({
              ...showDropdownboxSettingForm,
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
            setShowDropdownboxSettingForm({
              ...showDropdownboxSettingForm,
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

export default DropdownboxSetting;
