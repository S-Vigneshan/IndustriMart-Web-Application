import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaTruck} from 'react-icons/fa';
import axios from 'axios';
import './confirmation.css';

const OrderConfirmation = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
        setOrderDetails(response.data);
      } catch (error) {
        setError('Failed to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="error-container">
        <h3>Oops!</h3>
        <p>{error || "Order not found"}</p>
        <Button variant="primary" onClick={() => navigate('/shop')}>
          Return to Shop
        </Button>
      </div>
    );
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  return (
    <Container className="confirmation-container">
      <div className="success-header">
        <FaCheckCircle className="success-icon" />
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase. Your order has been successfully placed.</p>
        <div className="order-id">Order ID: #{orderId}</div>
      </div>

      <div className="order-status-timeline">
        <div className="status-item active">
          <FaCheckCircle />
          <p>Order Placed</p>
        </div>
        <div className="status-item">
          <FaBox />
          <p>Processing</p>
        </div>
        <div className="status-item">
          <FaTruck />
          <p>Shipping</p>
        </div>
        <div className="status-item">
          <FaCheckCircle />
          <p>Delivered</p>
        </div>
      </div>

      <Row className="order-details">
        <Col md={6} className="mb-4">
          <div className="details-section">
            <h3>Delivery Details</h3>
            <div className="details-content">
              <p className="recipient-name">
                {orderDetails.shippingDetails.firstName} {orderDetails.shippingDetails.lastName}
              </p>
              <p>{orderDetails.shippingDetails.address}</p>
              <p>{orderDetails.shippingDetails.city}</p>
              <p>Phone: {orderDetails.shippingDetails.phone}</p>
              <p>Email: {orderDetails.shippingDetails.email}</p>
            </div>
          </div>
        </Col>

        <Col md={6} className="mb-4">
          <div className="details-section">
            <h3>Order Summary</h3>
            <div className="details-content">
              <div className="order-items">
  {orderDetails.items.map((item, index) => (
    <div key={index} className="order-item">
      <div className="item-details">
        <h6>{item.name}</h6>
        <div className="item-meta">
          <span className="size">Size: {item.variation?.size || 'N/A'}</span>
          <span className="quantity">Qty: {item.quantity}</span>
        </div>
      </div>
      <div className="price-details">
        <span className="unit-price">රු {item.price.toFixed(2)} each</span>
        <span className="total-price">රු {(item.price * item.quantity).toFixed(2)}</span>
      </div>
    </div>
  ))}
</div>
              <div className="total-amount">
                <span>Total Amount</span>
                <span>රු {orderDetails.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <div className="delivery-info">
        <h3>Estimated Delivery</h3>
        <p>{estimatedDelivery.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</p>
      </div>

      <div className="actions">
        <Button variant="primary" size="lg" onClick={() => navigate('/shop')}>
          Continue Shopping
        </Button>
        
      </div>
    </Container>
  );
};

export default OrderConfirmation;