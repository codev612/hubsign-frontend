import React, { useState } from "react";
import * as dateFns from "date-fns";

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  return (
    <div className="p-4 border rounded-lg shadow-md w-[350px]">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentDate(dateFns.subMonths(currentDate, 1))}>◀</button>
        <h2 className="text-lg font-semibold">{dateFns.format(currentDate, "MMMM yyyy")}</h2>
        <button onClick={() => setCurrentDate(dateFns.addMonths(currentDate, 1))}>▶</button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2">{day}</div>
        ))}
        {generateDays().map((day, index) => (
          <button
            key={index}
            className={`p-2 rounded-md ${
              selectedDate && dateFns.isSameDay(day, selectedDate) ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setSelectedDate(day)}
          >
            {dateFns.format(day, "d")}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;