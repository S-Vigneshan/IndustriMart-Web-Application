import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./shop.css";

const ShopPage = () => {
  const navigate = useNavigate();

  // Original product data
  const [products] = useState([
    { id: 1, name: "Aluminium Sheet", price: 50.0, stock: true, image: "https://via.placeholder.com/150", category: "Sheets" },
    { id: 2, name: "Bronze Sheet", price: 60.0, stock: true, image: "https://via.placeholder.com/150", category: "Sheets" },
    { id: 3, name: "Copper Rod", price: 30.0, stock: true, image: "https://via.placeholder.com/150", category: "Rods" },
    { id: 4, name: "Brass Rod", price: 40.0, stock: true, image: "https://via.placeholder.com/150", category: "Rods" },
    { id: 5, name: "Bronze Rod", price: 45.0, stock: false, image: "https://via.placeholder.com/150", category: "Rods" },
    { id: 6, name: "Plastic Bottle", price: 10.0, stock: true, image: "https://via.placeholder.com/150", category: "Bottles" },
    { id: 7, name: "Empty Glass Bottle", price: 20.0, stock: true, image: "https://via.placeholder.com/150", category: "Bottles" },
    { id: 8, name: "Cardboard Box", price: 15.0, stock: true, image: "https://via.placeholder.com/150", category: "Packaging Materials" },
    { id: 9, name: "Polypropylene Bag", price: 5.0, stock: true, image: "https://via.placeholder.com/150", category: "Packaging Materials" },
    { id: 10, name: "Scrap Aluminum", price: 25.0, stock: true, image: "https://via.placeholder.com/150", category: "Scrap Metal" },
    { id: 11, name: "Scrap Copper", price: 35.0, stock: true, image: "https://via.placeholder.com/150", category: "Scrap Metal" },
  ]);

  // State for filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOption, setSortOption] = useState("");

  // Handle category change
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  // Handle sorting change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Apply filters and sorting
  const filteredProducts = products
    .filter((product) => (categoryFilter ? product.category === categoryFilter : true))
    .sort((a, b) => {
      if (sortOption === "price-low") return a.price - b.price; // Low to High
      if (sortOption === "price-high") return b.price - a.price; // High to Low
      return 0; // Default (no sorting)
    });

  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <div className="shop-container">
      {/* Header Section */}
      <header className="shop-header">
        <h1>IndustriMart Shop</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search products..." />
          <button>Search</button>
        </div>
      </header>

      {/* Filter Section */}
      <div className="filter-section">
        <h3>Filters</h3>
        <select onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          <option value="Sheets">Sheets</option>
          <option value="Rods">Rods</option>
          <option value="Bottles">Bottles</option>
          <option value="Packaging Materials">Packaging Materials</option>
          <option value="Scrap Metal">Scrap Metal</option>
        </select>
        <select onChange={handleSortChange}>
          <option value="">Sort By</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Product Listing */}
      <div className="product-list">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>රු. {product.price.toFixed(2)}</p>
            <p className={product.stock ? "in-stock" : "out-of-stock"}>
              {product.stock ? "In Stock" : "Out of Stock"}
            </p>
            <button
              className="view-details-btn"
              onClick={() => handleViewDetails(product)}
            >
              View Details
            </button>
          </div>
        ))}
        {filteredProducts.length === 0 && <p>No products match the filters.</p>}
      </div>
    </div>
  );
};

export default ShopPage;
