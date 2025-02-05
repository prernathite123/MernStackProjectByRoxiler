import React from "react";
import { useMonth } from "../context/MonthContext"; // Import from the correct path

const MonthSelector = () => {
  const { selectedMonth, setSelectedMonth } = useMonth();

  return (
    <div>
      <label htmlFor="month">Select Month: </label>
      <select id="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
        {[
          "January", "February", "March", "April",
          "May", "June", "July", "August",
          "September", "October", "November", "December"
        ].map((month) => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
    </div>
  );
};

export default MonthSelector;
