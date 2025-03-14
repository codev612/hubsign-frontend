import { useEffect, useState } from "react";
import { Checkbox, Button } from "@heroui/react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

import { DateboxSettingProps } from "@/interface/interface";
import { useUser } from "@/context/user";

const DateboxSetting: React.FC<DateboxSettingProps> = ({
  showDateboxSettingForm,
  setShowDateboxSettingForm,
  recipients,
  setDateboxSetting,
  signMode,
}) => {
  useEffect(() => {
    setSelectRecipient(showDateboxSettingForm.value.recipient);
    setCheckRequired(showDateboxSettingForm.value.required);
    setDateFormat(showDateboxSettingForm.value.format);
    setLockedToday(showDateboxSettingForm.value.lockedToday);
    setSelectedDate(showDateboxSettingForm.value.selectedDate);
  }, [showDateboxSettingForm]);

  const [selectRecipient, setSelectRecipient] = useState<string>(
    showDateboxSettingForm.value.recipient,
  );
  const [checkRequired, setCheckRequired] = useState<boolean>(
    showDateboxSettingForm.value.required,
  );
  const [dateFormat, setDateFormat] = useState<string>(
    showDateboxSettingForm.value.format,
  );
  const [lockedToday, setLockedToday] = useState<boolean>(
    showDateboxSettingForm.value.lockedToday,
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    showDateboxSettingForm.value.selectedDate,
  );
  const [onlyMyself, setOnlyMyself] = useState<boolean>(false);

  const userContextValues = useUser();

  useEffect(() => {
    if (
      recipients.length === 1 &&
      recipients[0].email === userContextValues.userData.email
    ) {
      setOnlyMyself(true);
    } else {
      setOnlyMyself(false);
    }
  }, [selectRecipient, recipients]);

  useEffect(() => {
    if (selectedDate) {
      setDateboxSetting({
        uid: showDateboxSettingForm.uid,
        show: false,
        value: {
          ...showDateboxSettingForm.value,
          selectedDate: selectedDate,
        },
      });
    }
  }, [selectedDate]);

  return (
    <div
      className="absolute bg-white p-5 rounded-lg shadow-lg flex flex-col w-[300] gap-2 text-text"
      style={{
        left: showDateboxSettingForm.position.left,
        top: showDateboxSettingForm.position.top,
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
        value={dateFormat}
        onChange={(e) => setDateFormat(e.target.value)}
      >
        <option value="mm/dd/yyyy">MM/DD/YYYY</option>
        <option value="dd/mm/yyyy">DD/MM/YYYY</option>
        <option value="yyyy/mm/dd">YYYY/MM/DD</option>
      </select>
      <Checkbox
        className="text-white"
        isSelected={lockedToday}
        onValueChange={() => setLockedToday(!lockedToday)}
      >
        Lock to the date of signing
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
            setDateboxSetting({
              uid: showDateboxSettingForm.uid,
              value: {
                ...showDateboxSettingForm.value,
                recipient: selectRecipient,
                format: dateFormat,
                required: checkRequired,
                lockedToday: lockedToday,
              },
            });
            setShowDateboxSettingForm({
              ...showDateboxSettingForm,
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
            setShowDateboxSettingForm({
              ...showDateboxSettingForm,
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

export default DateboxSetting;
