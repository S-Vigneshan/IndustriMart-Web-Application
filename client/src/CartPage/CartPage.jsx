import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './CartPage.css';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateCartQuantity, 
    calculateTotal,
    error,
    clearError 
  } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={clearError} className="close-error">×</button>
        </div>
      )}

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <ul>
            {cartItems.map((item) => {
  const isCustomSize = item.variation.isCustom;
  const sizeObj = !isCustomSize ? item.defaultSizes.find(s => s.size === item.variation.size) : null;
  const stockAvailable = !isCustomSize ? (sizeObj?.stock || 0) : Infinity;
  const isOutOfStock = !isCustomSize && stockAvailable === 0;

  return (
    <li key={item.id} className="cart-item">
      <img src={item.image} alt={item.name} />
      <div>
        <h4>{item.name}</h4>
        <p>Size: {item.variation.size}</p>
        <p>Price: රු. {item.variation.price}</p>
        <div className="quantity-control">
          <label>
            Quantity:
            <input
              type="number"
              value={item.quantity}
              min="1"
              max={isCustomSize ? undefined : stockAvailable}
              onChange={(e) => updateCartQuantity(item.id, Number(e.target.value), stockAvailable, isCustomSize)}
              disabled={isOutOfStock}
            />
          </label>
          {!isCustomSize && (
            <span className={`stock-info ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
              {isOutOfStock ? 'Out of stock' : `Stock Available`}
            </span>
          )}
        </div>
        <p>Total Price: රු. {(item.variation.price * item.quantity).toFixed(2)}</p>
        <button onClick={() => removeFromCart(item.id)}>Remove</button>
      </div>
    </li>
  );
})}
          </ul>

          <div className="cart-total">
            <h3>Grand Total: රු. {calculateTotal()}</h3>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;