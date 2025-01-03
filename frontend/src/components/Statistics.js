import React, { useEffect, useState } from "react";
import axios from "axios";
import "./statistics.css"; 

const Statistics = () => {
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });
  const [selectedMonth, setSelectedMonth] = useState(""); 
  const [error, setError] = useState(null);

  
  useEffect(() => {
    if (selectedMonth) {
      axios
        .get(`http://localhost:5000/api/statistics?month=${selectedMonth}`)
        .then((response) => {
          console.log("Statistics data:", response.data);
          setStatistics(response.data);
          setError(null);
        })
        .catch((err) => {
          console.error("Error fetching statistics:", err);
          setError("Failed to fetch statistics. Please try again later.");
        });
    }
  }, [selectedMonth]);

  
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="statistics-container">
      <h2>Statistics</h2>
      <div className="month-filter">
        <label htmlFor="month">Select Month:</label>
        <select
          id="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="month-dropdown"
        >
          <option value="">-- Select a Month --</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </div>
      {selectedMonth && <h3>Statistics for {selectedMonth}</h3>}
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="statistics-boxes">
          <div className="statistics-box">
            <h3>Total Sale Amount</h3>
            <p>${statistics.totalSaleAmount.toFixed(2)}</p>
          </div>
          <div className="statistics-box">
            <h3>Total Sold Items</h3>
            <p>{statistics.totalSoldItems}</p>
          </div>
          <div className="statistics-box">
            <h3>Total Not Sold Items</h3>
            <p>{statistics.totalNotSoldItems}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
