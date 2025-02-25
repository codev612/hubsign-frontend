import React from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import * as dateFns from "date-fns";

interface CalendarProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  setSelectedDate,
}) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // Months array
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Years range (2000 to 2050)
  const years = Array.from({ length: 51 }, (_, i) => 2000 + i);

  // Get start and end of the current month
  const monthStart = dateFns.startOfMonth(currentDate);
  const monthEnd = dateFns.endOfMonth(monthStart);
  const startDate = dateFns.startOfWeek(monthStart);
  const endDate = dateFns.endOfWeek(monthEnd);

  // Generate calendar grid (array of weeks)
  const generateDays = () => {
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = dateFns.addDays(day, 1);
    }

    return days;
  };

  // Handle month change
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);

    setCurrentDate(dateFns.setMonth(currentDate, newMonth));
  };

  // Handle year change
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);

    setCurrentDate(dateFns.setYear(currentDate, newYear));
  };

  // Handle "Today" button click
  const handleTodayClick = () => {
    const today = new Date();

    setCurrentDate(today);
    setSelectedDate(today);
  };

  return (
    <div className="border bg-[#F8F8F8] rounded-lg shadow-md w-[300px]">
      {/* Calendar Header */}
      <div className="flex p-2 justify-between items-center mb-4">
        {/* Month Select */}

        <select
          className="border p-2 rounded-lg"
          value={dateFns.getMonth(currentDate)}
          onChange={handleMonthChange}
        >
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>

        {/* Year Select */}
        <select
          className="border p-2 rounded-lg"
          value={dateFns.getYear(currentDate)}
          onChange={handleYearChange}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Buttons aligned to the right */}
        <div className="flex gap-1">
          <button
            className="p-0 rounded hover:bg-gray-300"
            onClick={() => setCurrentDate(dateFns.subMonths(currentDate, 1))}
          >
            <KeyboardArrowLeftIcon />
          </button>
          <button
            className="p-0 rounded hover:bg-gray-300"
            onClick={() => setCurrentDate(dateFns.addMonths(currentDate, 1))}
          >
            <KeyboardArrowRightIcon />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid bg-white grid-cols-7 text-center text-sm font-medium">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="p-2 bg-[#F8F8F8]">
            {day}
          </div>
        ))}
        {generateDays().map((day, index) => {
          const isCurrentMonth = dateFns.isSameMonth(day, currentDate);
          const isToday = dateFns.isToday(day);
          const isSelected =
            selectedDate && dateFns.isSameDay(day, selectedDate);

          return (
            <button
              key={index}
              className={`p-2 rounded-md ${
                !isCurrentMonth ? "text-gray-400" : ""
              } ${isToday ? "border-2 border-blue-500" : ""} ${
                isSelected ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedDate(day)} // Controlled by parent
            >
              {dateFns.format(day, "d")}
            </button>
          );
        })}
      </div>

      {/* Today button */}
      <div className="p-2 bg-white">
        <button
          className="w-full p-1 border-1 border-gray-100 rounded-lg bg-white hover:bg-gray-200"
          onClick={handleTodayClick}
        >
          Today
        </button>
      </div>
    </div>
  );
};

export default Calendar;
