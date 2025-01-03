import React, { useState } from 'react';
import BarChartComponent from './components/BarChartComponent';
import PieChart from './components/PieChart'; // Import the PieChartComponent
import Products from './components/Products';
import Statistics from './components/Statistics';
import './App.css';

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState('January');

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <>
    <Products />
    <Statistics />
      <h1>Product Statistics</h1>
      <label htmlFor="month">Select Month: </label>
      <select id="month" value={selectedMonth} onChange={handleMonthChange}>
        {[
          "January", "February", "March", "April",
          "May", "June", "July", "August",
          "September", "October", "November", "December"
        ].map((month) => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
      
      <BarChartComponent selectedMonth={selectedMonth} />
      <PieChart month={selectedMonth} />
      
      
    </>
  );
};

export default App;
