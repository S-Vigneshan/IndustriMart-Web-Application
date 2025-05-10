import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './CartPage.css';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, updateCartQuantity, calculateTotal } = useContext(CartContext);
  const navigate = useNavigate();


  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <p>Size: {item.variation.size}</p>
                  <p>Price: රු. {item.variation.price}</p>
                  <label>
                    Quantity:
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => updateCartQuantity(item.id, Number(e.target.value))} // Convert input to number
                    />
                  </label>
                  <p>Total Price: රු. {(item.variation.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>

          {/* Grand Total */}
          <div className="cart-total">
            <h3>Grand Total: රු. {calculateTotal()}</h3>
          </div>

          {/* Checkout Button */}
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
