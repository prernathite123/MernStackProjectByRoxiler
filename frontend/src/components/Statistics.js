import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMonth } from "../context/MonthContext";  // ✅ Import context
import "./statistics.css"; 

const Statistics = () => {
  const { selectedMonth } = useMonth();  // ✅ Use global state for month selection
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });
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

  return (
    <div className="statistics-container">
      <h2>Statistics for {selectedMonth}</h2>
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
