import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./shop.css";

const ShopPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Add this line
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/products'),
          axios.get('http://localhost:5000/api/admin/categories')
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search button click
  const handleSearch = () => {
    // The filtering will happen automatically through filteredProducts
  };
  const isProductInStock = (product) => {
  if (!product.defaultSizes || product.defaultSizes.length === 0) return false;
  return product.defaultSizes.some(size => size.stock > 0);
};
  

  // Apply filters and sorting
  const filteredProducts = products
    .filter((product) => {
      const matchesCategory = categoryFilter ? product.category._id === categoryFilter : true;
      const matchesSearch = searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.category && product.category.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const priceA = a.defaultSizes && a.defaultSizes[0] ? a.defaultSizes[0].price : 0;
      const priceB = b.defaultSizes && b.defaultSizes[0] ? b.defaultSizes[0].price : 0;
      
      if (sortOption === "price-low") return priceA - priceB; // Low to High
      if (sortOption === "price-high") return priceB - priceA; // High to Low
      return 0; // Default (no sorting)
    });

  const handleViewDetails = (product) => {
  navigate(`/product/${product._id}`, { state: { product } });
};

  return (
    <div className="shop-container">
      {/* Header Section */}
      <header className="shop-header">
        <h1>IndustriMart Shop</h1>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </header>

      {/* Filter Section */}
      <div className="filter-section">
        <h3>Filters</h3>
        <select onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <select onChange={handleSortChange}>
          <option value="">Sort By</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Product Listing */}
      <div className="product-list">
  {filteredProducts.map((product) => {
    const hasStock = isProductInStock(product);
    
    return (
      <div className={`product-card ${!hasStock ? 'out-of-stock' : ''}`} key={product._id}>
        <img 
          src={product.images && product.images[0] ? 
            product.images[0].url : 
            'http://localhost:5000/placeholder.jpg'} 
          alt={product.name}
          onError={(e) => {
            e.target.src = 'http://localhost:5000/placeholder.jpg';
          }}
        />
        <h3>{product.name}</h3>
        <p>රු. {product.defaultSizes && product.defaultSizes[0] ? 
          product.defaultSizes[0].price.toFixed(2) : 
          "Price varies"}</p>
        
        {!hasStock ? (
          <div className="out-of-stock-label">Out of Stock</div>
        ) : (
          <button
            className="view-details-btn"
            onClick={() => handleViewDetails(product)}
          >
            View Details
          </button>
        )}
      </div>
    );
  })}
  {filteredProducts.length === 0 && <p>No products match the filters.</p>}
</div>
    </div>
  );
};

export default ShopPage;
