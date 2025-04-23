import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./shop.css";

const ShopPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

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
          <div className="product-card" key={product._id}>
            <img 
              src={product.images && product.images[0] ? product.images[0].url : '/placeholder.jpg'} 
              alt={product.name} 
            />
            <h3>{product.name}</h3>
            <p>රු. {product.defaultSizes && product.defaultSizes[0] ? 
              product.defaultSizes[0].price.toFixed(2) : 
              "Price varies"}</p>
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
