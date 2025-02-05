import React, { useState, useEffect } from "react";
import axios from "axios";
import MonthSelector from "./MonthSelector";
import { useMonth } from "../context/MonthContext";
import "./product.css";

const Products = () => {
  const { selectedMonth, setSelectedMonth } = useMonth();
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]); // Stores all transactions
  const [filteredTransactions, setFilteredTransactions] = useState([]); // Stores filtered results
  const [searchTerm, setSearchTerm] = useState(""); // Stores user input for search
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const itemsPerPage = 5;
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Fetch products when the selected month changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products?month=${selectedMonth}`);
        setProducts(response.data);
        setCurrentPage(1); // Reset pagination on month change
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
      }
    };

    fetchProducts();
  }, [selectedMonth]);

  useEffect(() => {
    const filtered = transactions.filter((transaction) =>
      transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) // Case-insensitive search
    );
    setFilteredTransactions(filtered);
  }, [searchTerm, transactions]); 

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.price.toString().includes(searchTerm)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div>

      <h1>Transaction Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
<MonthSelector /> 
<input
        type="text"
        placeholder="Search transactions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
      />

{filteredTransactions.length > 0 ? (
        <ul>
          {filteredTransactions.map((transaction) => (
            <li key={transaction.id}>{transaction.name} - ${transaction.amount}</li>
          ))}
        </ul>
      ) : (
        <p>No transactions found</p>
      )}

      {/* Product Table */}
      <table border="1" style={{ borderCollapse: "collapse", width: "100%", marginTop: "10px" }}>
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

      {/* Pagination Controls */}
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
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          style={{ marginLeft: "5px", padding: "5px" }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Products;
