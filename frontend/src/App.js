import React from "react";
import { MonthProvider } from "./context/MonthContext"; 
import BarChartComponent from "./components/BarChartComponent";
import PieChart from "./components/PieChart";
import Products from "./components/Products";
import Statistics from "./components/Statistics";
import MonthSelector from "./components/MonthSelector";
import "./App.css";

const App = () => {
  return (
    <MonthProvider>
      <div className="app-container">
      
        
        <Products />

        <Statistics />
        <BarChartComponent />
        <PieChart />
      </div>
    </MonthProvider>
  );
};

export default App;
