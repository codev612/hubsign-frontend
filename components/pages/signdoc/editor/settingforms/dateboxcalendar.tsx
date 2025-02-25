import { useEffect, useState } from "react";

import { DateboxCalendarProps } from "@/interface/interface";
import Calendar from "@/components/ui/calendar";
import { useUser } from "@/context/user";

const DateboxCalendar: React.FC<DateboxCalendarProps> = ({
  showDateboxCalendarForm,
  setShowDateboxCalendarForm,
  recipients,
  setDateboxCalendar,
  signMode,
}) => {
  useEffect(() => {
    setSelectRecipient(showDateboxCalendarForm.value.recipient);
    setCheckRequired(showDateboxCalendarForm.value.required);
    setDateFormat(showDateboxCalendarForm.value.format);
    setLockedToday(showDateboxCalendarForm.value.lockedToday);
    setSelectedDate(showDateboxCalendarForm.value.selectedDate);
  }, [showDateboxCalendarForm]);

  const [selectRecipient, setSelectRecipient] = useState<string>(
    showDateboxCalendarForm.value.recipient,
  );
  const [checkRequired, setCheckRequired] = useState<boolean>(
    showDateboxCalendarForm.value.required,
  );
  const [dateFormat, setDateFormat] = useState<string>(
    showDateboxCalendarForm.value.format,
  );
  const [lockedToday, setLockedToday] = useState<boolean>(
    showDateboxCalendarForm.value.lockedToday,
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    showDateboxCalendarForm.value.selectedDate,
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
      setDateboxCalendar({
        uid: showDateboxCalendarForm.uid,
        show: false,
        value: {
          ...showDateboxCalendarForm.value,
          selectedDate: selectedDate,
        },
      });
    }
  }, [selectedDate]);

  return (
    <div
      className="absolute"
      style={{
        left: showDateboxCalendarForm.position.left,
        top: showDateboxCalendarForm.position.top,
      }}
    >
      <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
    </div>
  );
};

export default DateboxCalendar;
