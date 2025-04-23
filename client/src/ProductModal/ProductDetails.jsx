import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [customSize, setCustomSize] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);

  if (!state || !state.product) {
    navigate("/");
    return null;
  }

  const { product } = state;

  const handleSizeChange = (e) => {
    const selected = e.target.value;
    setSelectedSize(selected);
    setCustomSize(""); // Reset custom size when selecting preset size
    
    // Find the corresponding price for the selected size
    const sizeObj = product.defaultSizes.find(s => s.size === selected);
    setSelectedPrice(sizeObj ? sizeObj.price : 0);
  };

  const handleCustomSizeChange = (e) => {
    setCustomSize(e.target.value);
    setSelectedSize("custom");
    // Use the price of the largest default size for custom sizes
    const maxPriceSize = product.defaultSizes.reduce((prev, curr) => 
      prev.price > curr.price ? prev : curr
    );
    setSelectedPrice(maxPriceSize.price);
  };

  const handleAddToCart = () => {
    if ((!selectedSize && !customSize) || (selectedSize === "custom" && !customSize)) {
      alert("Please select or enter a size");
      return;
    }

    addToCart({
      id: product._id,
      name: product.name,
      image: product.images && product.images[0] ? product.images[0].url : '',
      variation: { 
        size: selectedSize === "custom" ? customSize : selectedSize, 
        price: selectedPrice 
      },
      quantity: 1,
    });

    navigate("/cart");
  };

  return (
    <div className="product-details-container">
      <h1>Product Details</h1>
      <div className="product-details-card">
        <img 
          src={product.images && product.images[0] ? product.images[0].url : ''} 
          alt={product.name} 
          className="product-image" 
        />
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        
        <div className="size-selection">
          <h3>Select Size:</h3>
          <select
            value={selectedSize}
            onChange={handleSizeChange}
          >
            <option value="">-- Select a Size --</option>
            {product.defaultSizes.map((sizeObj) => (
              <option key={sizeObj.size} value={sizeObj.size}>
                {sizeObj.size} - Rs. {sizeObj.price}
              </option>
            ))}
          </select>

          {product.allowCustomSize && (
            <div className="custom-size-input">
              <h3>Or Enter Custom Size:</h3>
              <input
                type="text"
                value={customSize}
                onChange={handleCustomSizeChange}
                placeholder="Enter your custom size"
              />
            </div>
          )}
        </div>

        {selectedSize && (
          <p className="selected-price">
            Selected Price: Rs. {selectedPrice}
          </p>
        )}

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
