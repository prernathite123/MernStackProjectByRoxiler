import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import './BarChart.css'; 


const BarChartComponent = ({ selectedMonth }) => {
  const [barChartData, setBarChartData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedMonth) {
      axios
        .get(`http://localhost:5000/api/bar-chart?month=${selectedMonth}`)
        .then((response) => {
          setBarChartData(response.data);
        })
        .catch((err) => {
          console.error("Error fetching bar chart data:", err);
          setError("Failed to fetch bar chart data. Please try again later.");
        });
    }
  }, [selectedMonth]);

  return (
    <div className="bar-chart-container">
      <h2>Bar Chart Stats - {selectedMonth}</h2>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#00C1D4" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default BarChartComponent;
