import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./ProductDetails.css";

// Unit conversion constants
const UNIT_CONVERSIONS = {
  meters: 1,
  centimeters: 0.01,
  inches: 0.0254,
  feet: 0.3048
};

const ProductDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [customSize, setCustomSize] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("meters");
  const [selectedSize, setSelectedSize] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  if (!state || !state.product) {
    navigate("/");
    return null;
  }

  const { product } = state;

  const calculatePrice = (size, unit) => {
    if (!size || !product.perMeterPrice) return 0;
    const sizeInMeters = parseFloat(size) * UNIT_CONVERSIONS[unit];
    return sizeInMeters * product.perMeterPrice;
  };

  const handleSizeSelect = (e) => {
    const value = e.target.value;
    setSelectedSize(value);
    setCustomSize("");
    
    if (value) {
      const selectedSizeObj = product.defaultSizes.find(s => s.size === value);
      if (selectedSizeObj) {
        setCalculatedPrice(selectedSizeObj.price);
      } else {
        setCalculatedPrice(0);
      }
    } else {
      setCalculatedPrice(0);
    }
  };
  const handleCustomSizeChange = (e) => {
    const value = e.target.value;
    setCustomSize(value);
    setSelectedSize("custom");
    const price = calculatePrice(value, selectedUnit);
    setCalculatedPrice(price);
  };

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    setSelectedUnit(newUnit);
    if (customSize) {
      const price = calculatePrice(customSize, newUnit);
      setCalculatedPrice(price);
    }
  };

  const handleAddToCart = () => {
  if (!selectedSize || (selectedSize === "custom" && !customSize)) {
    alert("Please select or enter a size");
    return;
  }

  const cartItem = {
    id: product._id,
    name: product.name,
    image: product.images?.[0]?.url || '',
    defaultSizes: product.defaultSizes,
    variation: {
      size: selectedSize === "custom" ? `${customSize} ${selectedUnit}` : selectedSize,
      price: selectedSize === "custom" ? calculatedPrice : product.defaultSizes.find(s => s.size === selectedSize)?.price,
      isCustom: selectedSize === "custom"
    },
    quantity: 1,
  };

  addToCart(cartItem);
  navigate("/cart");
};


  return (
    <div className="product-details-container">
      <div className="product-details-card">
        <div className="product-info">
          <div className="product-image">
            <img 
              src={product.images && product.images[0] ? product.images[0].url : 'http://localhost:5000/placeholder.jpg'} 
              alt={product.name}
              onError={(e) => {
                e.target.src = 'http://localhost:5000/placeholder.jpg';
              }}
            />
          </div>
          <div className="product-content">
            <h2 className="product-name">{product.name}</h2>
            <div className="product-category">
              <span className="category-label">Category:</span>
              <span className="category-name">{product.category?.name}</span>
            </div>
            <div className="product-description">
              <h3>Description:</h3>
              <p>{product.description || "No description available"}</p>
            </div>
            {product.perMeterPrice && (
              <div className="base-price">
                <span>Base Price:</span>
                <span className="price">රු {product.perMeterPrice.toFixed(2)} per meter</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="size-selection">
          <h3>Standard Sizes:</h3>
          <select
            value={selectedSize}
            onChange={handleSizeSelect}
          >
            <option value="">-- Select a Size --</option>
            {product.defaultSizes.map((sizeObj) => (
              <option key={sizeObj.size} value={sizeObj.size}>
                {sizeObj.size} - රු {sizeObj.price.toFixed(2)}
              </option>
            ))}
          </select>

          {selectedSize && !customSize && (
            <div className="calculated-price">
              <p>Selected Size Price: රු {calculatedPrice.toFixed(2)}</p>
            </div>
          )}

          {product.allowCustomSize && (
            <div className="custom-size-section">
              <h3>Custom Size:</h3>
              <div className="custom-size-inputs">
                <input
                  type="number"
                  value={customSize}
                  onChange={handleCustomSizeChange}
                  placeholder="Enter size"
                  step="0.01"
                  min="0"
                />
                <select 
                  value={selectedUnit} 
                  onChange={handleUnitChange}
                >
                  <option value="meters">Meters</option>
                  <option value="centimeters">Centimeters</option>
                  <option value="inches">Inches</option>
                  <option value="feet">Feet</option>
                </select>
              </div>
              {customSize && (
                <div className="calculated-price">
                  <p>Custom Size Price: රු {calculatedPrice.toFixed(2)}</p>
                  <p className="conversion-info">
                    ({customSize} {selectedUnit} = {(customSize * UNIT_CONVERSIONS[selectedUnit]).toFixed(2)} meters)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <button 
          className="add-to-cart-btn" 
          onClick={handleAddToCart}
          disabled={!selectedSize || (selectedSize === "custom" && !customSize)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;