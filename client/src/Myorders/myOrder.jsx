import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Badge, Row, Col } from 'react-bootstrap';
import { getToken } from '../services/authService';

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getToken();
        const userId = JSON.parse(atob(token.split('.')[1])).id;
        const response = await axios.get(`http://localhost:5000/api/orders/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data.orders);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
        console.error('Error:', err);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadgeVariant = (status) => {
    const variants = {
      'Pending': 'warning',
      'Processing': 'info',
      'Shipped': 'primary',
      'Delivered': 'success'
    };
    return variants[status] || 'secondary';
  };

  if (loading) return (
    <Container className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </Container>
  );

  if (error) return (
    <Container className="text-center py-5">
      <div className="alert alert-danger" role="alert">{error}</div>
    </Container>
  );

  return (
    <Container className="py-5">
      <h2 className="mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <h4>No orders found</h4>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <Row>
          {orders.map((order) => (
            <Col key={order._id} xs={12} className="mb-4">
              <Card className="shadow-sm">
                <Card.Header>
                  <Row className="align-items-center">
                    <Col>
                      <h6 className="mb-0">Order #{order._id}</h6>
                      <small className="text-muted">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </small>
                    </Col>
                    <Col xs="auto">
                      <Badge bg={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  {order.items.map((item, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <span className="fw-bold">{item.name}</span>
                        <br />
                        <small className="text-muted">Quantity: {item.quantity}</small>
                      </div>
                      <span>රු{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>Total Amount:</strong>
                    <strong>රු{order.totalAmount.toFixed(2)}</strong>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">
                    Shipping to: {order.shippingDetails.address}, {order.shippingDetails.city}
                  </small>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyOrder;