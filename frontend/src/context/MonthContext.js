import { createContext, useContext, useState } from "react";

const MonthContext = createContext();

export const MonthProvider = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState("March"); // Default month

  return (
    <MonthContext.Provider value={{ selectedMonth, setSelectedMonth }}>
      {children}
    </MonthContext.Provider>
  );
};

export const useMonth = () => useContext(MonthContext);
