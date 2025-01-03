import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import './PieChart.css';


ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const PieChart = ({ month }) => {
  const [chartData, setChartData] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPieChartData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/pie-chart?month=${month}`);
        const data = await response.json(); 

        if (response.ok && data.length > 0) {
          const labels = data.map((item) => item.category);
          const counts = data.map((item) => item.count);

         
          setChartData({
            labels: labels,
            datasets: [
              {
                label: 'Product Category Distribution',
                data: counts,
                backgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#FF9F40',
                  '#9966FF',
                  '#C9CBCF',
                ],
                borderColor: '#fff',
                borderWidth: 1,
              },
            ],
          });
          setLoading(false);
        } else {
          setError('No data available for the selected month');
          setLoading(false);
        }
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchPieChartData();
  }, [month]);

  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="pie-chart-container">
      <h2>Product Category Distribution for {month}</h2>
      {chartData.labels && chartData.datasets ? (
        <Pie data={chartData} />
      ) : (
        <p>No chart data available</p>
      )}
    </div>
  );
  
};

export default PieChart;
