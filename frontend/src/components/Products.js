import React, { useState, useEffect } from "react";
import axios from "axios";
import "./product.css";


const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("March");
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
  
    const itemsPerPage = 5;
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  
    useEffect(() => {
      axios
        .get("http://localhost:5000/api/products")
        .then((response) => {
          setProducts(response.data);
          setFilteredProducts(response.data);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setError("Failed to fetch products. Please try again later.");
        });
    }, []);
  
    useEffect(() => {
      const filtered = products.filter((product) => {
        const saleMonth = new Date(product.dateOfSale).toLocaleString("default", {
          month: "long",
        });
        const matchesSearch =
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.price.toString().includes(searchTerm);
  
        return saleMonth === selectedMonth && matchesSearch;
      });
      setFilteredProducts(filtered);
      setCurrentPage(1);
    }, [products, searchTerm, selectedMonth]);
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredProducts.slice(
      startIndex,
      startIndex + itemsPerPage
    );
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
    return (
      <div>
        <h1>Transaction Dashboard</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
  
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
        />
  
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px" }}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
  
        
  
        <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Price</th>
              <th>Description</th>
              <th>Category</th>
              <th>Image</th>
              <th>Sold</th>
              <th>Date of Sale</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.description}</td>
                <td>{product.category}</td>
                <td>
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                </td>
                <td>{product.sold ? "Yes" : "No"}</td>
                <td>{new Date(product.dateOfSale).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
  
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{ marginRight: "5px", padding: "5px" }}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            style={{ marginLeft: "5px", padding: "5px" }}
          >
            Next
          </button>
         
        </div>
      </div>
    );
  };
  
  export default Products;
  