import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './confirmation.css';

const OrderConfirmation = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch order details from backend
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders${orderId}`);
        setOrderDetails(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (!orderDetails) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  // Calculate estimated delivery date (7 days from now)
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  return (
    <Container className="py-5">
      <Card className="order-confirmation-card">
        <Card.Body>
          <div className="text-center mb-4">
            <i className="fas fa-check-circle success-icon"></i>
            <h2 className="mt-3">Thank You!</h2>
            <p className="lead">Your order has been placed successfully.</p>
          </div>

          <Row className="mb-4">
            <Col md={6}>
              <Card className="h-100">
                <Card.Body>
                  <h4>Order Information</h4>
                  <p><strong>Order ID:</strong> #{orderId}</p>
                  <p><strong>Order Date:</strong> {new Date().toLocaleDateString()}</p>
                  <p><strong>Estimated Delivery:</strong> {estimatedDelivery.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                  <p><strong>Payment Method:</strong> {orderDetails.payment.method}</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100">
                <Card.Body>
                  <h4>Delivery Address</h4>
                  <p>{orderDetails.shippingDetails.firstName} {orderDetails.shippingDetails.lastName}</p>
                  <p>{orderDetails.shippingDetails.address}</p>
                  <p>{orderDetails.shippingDetails.city}</p>
                  <p>Phone: {orderDetails.shippingDetails.phone}</p>
                  <p>Email: {orderDetails.shippingDetails.email}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="mb-4">
            <Card.Body>
              <h4>Order Summary</h4>
              <ListGroup variant="flush">
                {orderDetails.items.map((item, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">{item.name}</h6>
                      <small>Quantity: {item.quantity}</small>
                    </div>
                    <span>රු {item.price.toFixed(2)}</span>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item className="d-flex justify-content-between align-items-center fw-bold">
                  <span>Total Amount</span>
                  <span>රු {orderDetails.totalAmount.toFixed(2)}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body className="text-center">
              <h5>Need Help?</h5>
              <p>For any questions about your order, please contact our support team</p>
              <p>Email: support@example.com</p>
              <p>Or visit our <Button variant="link" onClick={() => navigate('/contact')}>Contact Us</Button> page</p>
            </Card.Body>
          </Card>

          <div className="text-center">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/shop')}
            >
              Continue Shopping
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderConfirmation;