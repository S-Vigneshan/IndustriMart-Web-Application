import React, { useContext, useState, useEffect } from 'react';
import { PAYHERE_CONFIG } from '../config/payhere';
import CryptoJS from 'crypto-js'; // You'll need to install this package
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaTruck } from 'react-icons/fa';
import axios from 'axios';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, calculateTotal,clearCart } = useContext(CartContext);
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
    setIsProcessing(true);
    const orderData = {
      items: cartItems,
      shippingDetails,
      totalAmount: calculateTotal(),
      userId: userId,
      payment: {
        method: 'COD',
        status: 'Pending'
      }
    };

    const response = await axios.post('http://localhost:5000/api/orders', orderData);
    
    // Clear cart after successful order
     clearCart();
    
    // Navigate to order confirmation with the new order ID
    navigate(`/order-confirmation/${response.data.orderId}`);
  } catch (error) {
    console.error('Error creating order:', error);
    alert('Failed to create order. Please try again.');
  } finally {
    setIsProcessing(false);
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

      window.payhere.onCompleted = function onCompleted(orderId) {
        clearCart();
        navigate(`/order-confirmation/${orderId}`);
      };
  
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
    <Container className="py-5">
      <Row className="g-4">
        <Col lg={7}>
          <div className="bg-white p-4 rounded-3 shadow-sm">
            <h2 className="mb-4 border-bottom pb-3">Shipping Details</h2>
            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={shippingDetails.firstName}
                      onChange={handleInputChange}
                      required
                      className="form-control-lg"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={shippingDetails.lastName}
                      onChange={handleInputChange}
                      required
                      className="form-control-lg"
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={shippingDetails.email}
                      onChange={handleInputChange}
                      required
                      className="form-control-lg"
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={shippingDetails.phone}
                      onChange={handleInputChange}
                      required
                      className="form-control-lg"
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={shippingDetails.address}
                      onChange={handleInputChange}
                      required
                      className="form-control-lg"
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={shippingDetails.city}
                      onChange={handleInputChange}
                      required
                      className="form-control-lg"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </div>
        </Col>

        <Col lg={5}>
          <div className="bg-white p-4 rounded-3 shadow-sm">
            <h2 className="mb-4 border-bottom pb-3">Order Summary</h2>
            <div className="order-items">
  {cartItems.map((item) => (
    <div key={item.id} className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
      <div>
        <h6 className="mb-0">{item.name}</h6>
        <small className="text-muted d-block">Size: {item.variation.size}</small>
        <small className="text-muted d-block">Quantity: {item.quantity}</small>
      </div>
      <div className="text-end">
        <div>රු {item.variation.price.toFixed(2)}</div>
        <small className="text-muted">
          Subtotal: රු {(item.variation.price * item.quantity).toFixed(2)}
        </small>
      </div>
    </div>
  ))}
</div>

            <div className="border-top pt-3 mt-4">
              <h4 className="d-flex justify-content-between">
                <span>Total</span>
                <span>රු {calculateTotal()}</span>
              </h4>

              <div className="payment-options mt-4">
                <h5 className="mb-3">Payment Method</h5>
                <div className="d-grid gap-2">
                  <Form.Check
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    className="payment-option p-3 border rounded"
                    label={
                      <div className="d-flex align-items-center">
                        <FaTruck className="me-2" />
                        <span>Cash on Delivery</span>
                      </div>
                    }
                    value="cod"
                    checked={shippingDetails.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                  />
                  <Form.Check
                    type="radio"
                    id="online"
                    name="paymentMethod"
                    className="payment-option p-3 border rounded"
                    label={
                      <div className="d-flex align-items-center">
                        <FaCreditCard className="me-2" />
                        <span>Online Payment</span>
                      </div>
                    }
                    value="online"
                    checked={shippingDetails.paymentMethod === 'online'}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-100 mt-4"
                onClick={handleSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;