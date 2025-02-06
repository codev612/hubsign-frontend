import React, { useState } from "react";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import * as dateFns from "date-fns";

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Months array
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
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
    setCurrentDate(today); // Set the current date to today
    setSelectedDate(today); // Optionally set the selected date to today as well
  };

  return (
    <div className="p-2 border rounded-lg shadow-md w-[300px]">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        {/* Month Select */}
        <select 
          className="border p-2 rounded-lg"
          value={dateFns.getMonth(currentDate)}
          onChange={handleMonthChange}
        >
          {months.map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </select>

        {/* Year Select */}
        <select 
          className="border p-2 rounded-lg"
          value={dateFns.getYear(currentDate)}
          onChange={handleYearChange}
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
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
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="p-2">{day}</div>
        ))}
        {generateDays().map((day, index) => {
          const isCurrentMonth = dateFns.isSameMonth(day, currentDate);
          const isToday = dateFns.isToday(day);
          const isSelected = selectedDate && dateFns.isSameDay(day, selectedDate);

          return (
            <button
              key={index}
              className={`p-2 rounded-md ${
                !isCurrentMonth ? "text-gray-400" : "" // Grey out days from previous/next month
              } ${
                isToday ? "border-2 border-blue-500" : "" // Border for today's date
              } ${
                isSelected ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedDate(day)} // Allow selecting any day
            >
              {dateFns.format(day, "d")}
            </button>
          );
        })}
      </div>

      {/* Today button */}
      <button 
        className="w-full p-1 border-1 border-gray-100 rounded-lg hover:bg-gray-200"
        onClick={handleTodayClick} // Call the function to go to today
      >
        Today
      </button>
    </div>
  );
};

export default Calendar;