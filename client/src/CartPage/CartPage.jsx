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
              // Find the correct size object from defaultSizes
              const sizeObj = item.defaultSizes?.find(s => s.size === item.variation.size);
              const maxStock = sizeObj?.stock || 0;
              
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
                          max={maxStock}
                          onChange={(e) => updateCartQuantity(item.id, Number(e.target.value), maxStock)}
                        />
                      </label>
                      {maxStock > 0 ? (
                        <span className="stock-info">
                          Available: {maxStock}
                        </span>
                      ) : (
                        <span className="stock-info out-of-stock">
                          Out of stock
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