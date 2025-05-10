import React, { useContext, useState, useEffect } from 'react';
import { PAYHERE_CONFIG } from '../config/payhere';
import CryptoJS from 'crypto-js'; // You'll need to install this package
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, calculateTotal } = useContext(CartContext);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'cod'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Extract user ID from token
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      setUserId(tokenPayload.id);
    } catch (error) {
      console.error('Error extracting user ID from token:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCashOnDelivery = async () => {
    try {
      const orderData = {
        items: cartItems,
        shippingDetails,
        totalAmount: calculateTotal(),
        userId: userId, // Use the actual user ID
        payment: {
          method: 'COD',
          status: 'Pending'
        }
      };

      const response = await axios.post('/api/orders', orderData);
      navigate(`/order-confirmation/${response.data.orderId}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  const handleOnlinePayment = async () => {
    try {
      const orderData = {
        items: cartItems,
        shippingDetails,
        totalAmount: calculateTotal(),
        userId: userId,
        payment: {
          method: 'Online',
          status: 'Pending'
        }
      };
  
      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      const orderId = response.data.orderId;
  
      if (!orderId) {
        throw new Error('Order ID not received from server');
      }
  
      // Create hash of the payment data
      const paymentData = {
        merchant_id: PAYHERE_CONFIG.MERCHANT_ID,
        order_id: orderId,
        amount: calculateTotal(),
        currency: "LKR",
        items: cartItems.map(item => item.name).join(', '),
        first_name: shippingDetails.firstName,
        last_name: shippingDetails.lastName,
        email: shippingDetails.email,
        phone: shippingDetails.phone,
        address: shippingDetails.address,
        city: shippingDetails.city,
        country: "Sri Lanka",
      };
  
      // Generate hash using merchant secret
      const hash = CryptoJS.MD5(
        PAYHERE_CONFIG.MERCHANT_ID +
        orderId +
        paymentData.amount +
        paymentData.currency +
        CryptoJS.MD5(PAYHERE_CONFIG.MERCHANT_SECRET).toString()
      ).toString();
  
      // Configure PayHere payment object
      const payment = {
        sandbox: PAYHERE_CONFIG.SANDBOX,
        merchant_id: PAYHERE_CONFIG.MERCHANT_ID,
        return_url: `${window.location.origin}/order-confirmation/${orderId}`,
        cancel_url: `${window.location.origin}/checkout`,
        notify_url: `${window.location.origin}/api/orders/${orderId}/verify`,
        order_id: orderId,
        items: paymentData.items,
        amount: paymentData.amount,
        currency: paymentData.currency,
        hash: hash, // Add the generated hash
        first_name: paymentData.first_name,
        last_name: paymentData.last_name,
        email: paymentData.email,
        phone: paymentData.phone,
        address: paymentData.address,
        city: paymentData.city,
        country: paymentData.country,
      };
  
      // Start PayHere payment
      window.payhere.startPayment(payment);
  
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (shippingDetails.paymentMethod === 'cod') {
        await handleCashOnDelivery();
      } else {
        await handleOnlinePayment();
      }
    } catch (error) {
      console.error('Error processing order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container className="checkout-page py-5">
      <Row>
        <Col md={7}>
          <h2>Shipping Details</h2>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={shippingDetails.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={shippingDetails.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={shippingDetails.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={shippingDetails.phone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={shippingDetails.address}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={shippingDetails.city}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary">Place Order</Button>
          </Form>
        </Col>

        <Col md={5}>
          <div className="order-summary">
            <h2>Order Summary</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-details">
                  <h5>{item.name}</h5>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: රු. {item.variation.price}</p>
                  <p>Subtotal: රු. {(item.variation.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
            <div className="total-amount">
  <h4>Total Amount: රු. {calculateTotal()}</h4>
  
  <Form.Group className="payment-method mt-4">
    <Form.Label><strong>Select Payment Method</strong></Form.Label>
    <div className="payment-options">
      <Form.Check
        type="radio"
        id="cod"
        name="paymentMethod"
        label="Cash on Delivery"
        value="cod"
        checked={shippingDetails.paymentMethod === 'cod'}
        onChange={handleInputChange}
        className="mb-2"
      />
      <Form.Check
        type="radio"
        id="online"
        name="paymentMethod"
        label="Online Payment"
        value="online"
        checked={shippingDetails.paymentMethod === 'online'}
        onChange={handleInputChange}
      />
    </div>

    {shippingDetails.paymentMethod === 'online' && (
      <div className="payment-info alert alert-info mt-3">
        <small>You will be redirected to the payment gateway after placing your order.</small>
      </div>
    )}
  </Form.Group>
</div>
          </div>
        </Col>
      </Row>
      {/* Update the submit button */}
      <Button 
        type="submit" 
        variant="primary" 
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Confirm Order'}
      </Button>
    </Container>
  );
};

export default CheckoutPage;