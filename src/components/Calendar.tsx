import React, { useState } from "react";
import { Calendar as ShadCalendar } from "./ui/calendar"; // Adjust to your library

export const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date); // Update the state with the selected date
      console.log("Selected date:", date);
    } else {
      setSelectedDate(null); // Handle cases where no date is selected
      console.warn("No date selected");
    }
  };

  return (
    <div className="p-4 justify-center">
      <ShadCalendar
        mode="single"
        selected={selectedDate || undefined} // Convert null to undefined for compatibility
        onSelect={handleDateChange} // Adjusted to match the expected type
      />
    </div>
  );
};
