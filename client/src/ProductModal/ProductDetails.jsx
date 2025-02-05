import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [customSize, setCustomSize] = useState(""); // For custom size input
  const [selectedSize, setSelectedSize] = useState(""); // For default size selection

  if (!state || !state.product) {
    navigate("/"); // Redirect if no product data is available
    return null;
  }

  const { product } = state;

  // Rules for products, including customizable and default sizes
  const productRules = {
    "Aluminium Sheet": {
      pricePerInch: 50,
      customizable: true,
      defaultSizes: ["12x12", "24x24", "36x36"],
    },
    "Bronze Sheet": {
      pricePerInch: 60,
      customizable: true,
      defaultSizes: ["12x12", "24x24", "48x48"],
    },
    "Copper Rod": {
      pricePerInch: 30,
      customizable: true,
      defaultSizes: ["12", "24", "36"],
    },
    "Brass Rod": {
      pricePerInch: 40,
      customizable: true,
      defaultSizes: ["12", "24", "48"],
    },
    "Bronze Rod": {
      pricePerInch: 45,
      customizable: true,
      defaultSizes: ["12", "18", "36"],
    },
    "Plastic Bottle": {
      pricePerUnit: 10,
      customizable: false,
      defaultSizes: ["500ml", "1L", "5L"],
    },
    "Empty Glass Bottle": {
      pricePerUnit: 20,
      customizable: false,
      defaultSizes: ["500ml", "1L", "5L"],
    },
    "Cardboard Box": {
      pricePerUnit: 15,
      customizable: false,
      defaultSizes: ["Small", "Large"],
    },
    "Polypropylene Bag": {
      pricePerUnit: 5,
      customizable: false,
    },
    "Scrap Aluminum": {
      pricePerUnit: 25,
      customizable: false,
    },
    "Scrap Copper": {
      pricePerUnit: 35,
      customizable: false,
    },
  };

  const rules = productRules[product.name] || {};

  const calculatePrice = (size) => {
    if (rules.customizable) {
      const dimensions = size.split("x").map(Number);
      if (dimensions.length === 2) {
        return dimensions[0] * dimensions[1] * rules.pricePerInch;
      } else if (dimensions.length === 1) {
        return dimensions[0] * rules.pricePerInch;
      }
    }
    return rules.pricePerUnit || 0; // Price for non-customizable products
  };

  const handleAddToCart = () => {
    const size = selectedSize || customSize;

    if (rules.customizable && !size) {
      alert("Please select or enter a valid size.");
      return;
    }

    const totalPrice = calculatePrice(size);

    if (rules.customizable && totalPrice === 0) {
      alert("Please enter a valid size.");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      variation: rules.customizable ? { size, price: totalPrice } : { size },
      quantity: 1,
    });

    navigate("/cart");
  };

  return (
    <div className="product-details-container">
      <h1>Product Details</h1>
      <div className="product-details-card">
        <img src={product.image} alt={product.name} className="product-image" />
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        {rules.customizable || rules.defaultSizes ? (
          <>
            {rules.customizable && <p>Base Price per Inch: Rs. {rules.pricePerInch}</p>}
            <h3>Select a Default Size:</h3>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="">-- Select a Size --</option>
              {rules.defaultSizes?.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            {rules.customizable && (
              <>
                <h3>Or Enter Custom Dimensions (in inches):</h3>
                <input
                  type="text"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  placeholder="e.g., 12x24"
                />
              </>
            )}
            <p>
              Calculated Price: Rs. 
              {selectedSize
                ? calculatePrice(selectedSize).toFixed(2)
                : customSize
                ? calculatePrice(customSize).toFixed(2)
                : "0.00"}
            </p>
          </>
        ) : (
          <p>Price: Rs{rules.pricePerUnit}</p>
        )}

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
