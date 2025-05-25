import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);

 const addToCart = (product) => {
  setCartItems((prevItems) => {
    const itemExists = prevItems.find(item => item.id === product.id);
    const isCustomSize = product.variation.size.includes(' '); // Check if it's a custom size
    
    if (itemExists) {
      // Only check stock for default sizes
      if (!isCustomSize) {
        const selectedSize = product.variation.size;
        const sizeObj = product.defaultSizes?.find(s => s.size === selectedSize);
        
        if (itemExists.quantity + 1 > sizeObj?.stock) {
          setError(`Sorry, only ${sizeObj.stock} items available in stock`);
          return prevItems;
        }
      }
      return prevItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    }
    return [...prevItems, { ...product, quantity: 1 }];
  });
};

const updateCartQuantity = (productId, newQuantity, maxStock, isCustomSize) => {
  if (!isCustomSize && newQuantity > maxStock) {
    setError(`Sorry, only ${maxStock} items available in stock`);
    return;
  }

  setCartItems((prevItems) =>
    prevItems.map(item =>
      item.id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
    )
  );
  setError(null);
};

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
    setError(null);
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => 
      acc + item.variation.price * item.quantity, 0
    ).toFixed(2);
  };

  const clearError = () => setError(null);
  const clearCart = () => {
    setCartItems([]);
    setError(null);
  };


  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      calculateTotal,
      error,
      clearError,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};