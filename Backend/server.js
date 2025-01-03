const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());


app.get('/api/products', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    res.status(200).json(response.data); 
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from the API' });
  }
});

app.get('/api/statistics', async (req, res) => {
    const { month } = req.query;
  
    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }
  
    try {
      const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
      const products = response.data;
  
      console.log("Fetched products:", products.slice(0, 5));
  
      const filteredProducts = products.filter((product) => {
        const saleDate = new Date(product.dateOfSale);
  
        if (isNaN(saleDate)) {
          console.error("Invalid date:", product.dateOfSale);
          return false;
        }
  
        const productMonth = saleDate.toLocaleString("default", { month: "long" }).toLowerCase();
        return productMonth === month.toLowerCase();
      });
  
      console.log("Filtered products for month:", month, filteredProducts.length);
  
      if (filteredProducts.length === 0) {
        return res.status(404).json({ error: `No products found for the month: ${month}` });
      }
  
      const totalSaleAmount = filteredProducts
        .filter((product) => product.sold)
        .reduce((sum, product) => sum + product.price, 0);
  
      const totalSoldItems = filteredProducts.filter((product) => product.sold).length;
      const totalNotSoldItems = filteredProducts.filter((product) => !product.sold).length;
  
      console.log("Total Sale Amount:", totalSaleAmount);
      console.log("Total Sold Items:", totalSoldItems);
      console.log("Total Not Sold Items:", totalNotSoldItems);
  
      res.status(200).json({
        totalSaleAmount,
        totalSoldItems,
        totalNotSoldItems,
      });
    } catch (error) {
      console.error('Error fetching data or calculating statistics:', error.message);
      res.status(500).json({ error: 'Failed to fetch statistics. Please try again later.' });
    }
  });



app.get('/api/bar-chart', async (req, res) => {
    const { month } = req.query;
  
    
    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }
  
    try {
     
      const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
      const products = response.data;
  
      const filteredProducts = products.filter((product) => {
        const saleDate = new Date(product.dateOfSale);
        if (isNaN(saleDate)) {
          console.error("Invalid date:", product.dateOfSale);
          return false; 
        }
  
        const productMonth = saleDate.toLocaleString('default', { month: 'long' }).toLowerCase();
        return productMonth === month.toLowerCase();
      });
  
     
      const priceRanges = [
        { range: "0-100", min: 0, max: 100, count: 0 },
        { range: "101-200", min: 101, max: 200, count: 0 },
        { range: "201-300", min: 201, max: 300, count: 0 },
        { range: "301-400", min: 301, max: 400, count: 0 },
        { range: "401-500", min: 401, max: 500, count: 0 },
        { range: "501-600", min: 501, max: 600, count: 0 },
        { range: "601-700", min: 601, max: 700, count: 0 },
        { range: "701-800", min: 701, max: 800, count: 0 },
        { range: "801-900", min: 801, max: 900, count: 0 },
        { range: "901-above", min: 901, max: Infinity, count: 0 },
      ];
  
      
      filteredProducts.forEach((product) => {
        const price = product.price;
  
        for (let range of priceRanges) {
          if (price >= range.min && price <= range.max) {
            range.count++;
            break;
          }
        }
      });
  
      
      const responseData = priceRanges.map((range) => ({
        range: range.range,
        count: range.count,
      }));
  
      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error fetching data or calculating bar chart:', error.message);
      res.status(500).json({ error: 'Failed to generate bar chart data. Please try again later.' });
    }
  });

  app.get('/api/pie-chart', async (req, res) => {
    const { month } = req.query;
  
    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }
  
    try {
      const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
      const products = response.data;
  
      const filteredProducts = products.filter((product) => {
        const saleDate = new Date(product.dateOfSale);
        console.log(`Checking product with date: ${saleDate}`);
        if (isNaN(saleDate)) {
          console.log("Invalid date detected");
          return false; 
        }
  
        const productMonth = saleDate.toLocaleString('default', { month: 'long' }).toLowerCase();
        console.log(`Product month: ${productMonth}, Selected month: ${month.toLowerCase()}`);
        return productMonth === month.toLowerCase();
      });
  
      console.log("Filtered Products:", filteredProducts);
  
      const categoryCounts = filteredProducts.reduce((acc, product) => {
        const category = product.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category]++;
        return acc;
      }, {});
  
      const formattedData = Object.keys(categoryCounts).map((category) => ({
        category,
        count: categoryCounts[category],
      }));
  
      if (formattedData.length === 0) {
        return res.status(404).json({ error: "No data available for the selected month" });
      }
  
      res.status(200).json(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  });
  
  
  
 

  app.get("/api/combined-data", async (req, res) => {
    const { month } = req.query;
  
    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }
  
    try {
     
      const api1 = `http://localhost:5000/api/products`;
      const api2 = `http://localhost:5000/api/statistics?month=${month}`;
      const api3 = `http://localhost:5000/api/bar-chart?month=${month}`;
      const api4 = `http://localhost:5000/api/pie-chart?month=${month}`;
  
      
      const [response1, response2, response3, response4] = await axios.all([
        axios.get(api1),
        axios.get(api2),
        axios.get(api3),
        axios.get(api4),
      ]);
  
      
      const data1 = response1.data;
      const data2 = response2.data;
      const data3 = response3.data;
      const data4 = response4.data;
  
      
      const combinedData = {
        api1Data: data1,
        api2Data: data2,
        api3Data: data3,
        api4Data: data4, 
      };
  
     
      res.status(200).json(combinedData);
    } catch (error) {
      console.error("Error fetching data from APIs:", error.message);
      res.status(500).json({ error: "Failed to fetch data from one or more APIs" });
    }
  });
  




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
