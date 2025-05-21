import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Badge, Row, Col ,Alert, Spinner} from 'react-bootstrap';
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
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <Spinner animation="border" variant="primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );

  if (error) return (
    <Container className="py-5">
      <Alert variant="danger">{error}</Alert>
    </Container>
  );

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2 className="display-6 fw-bold text-primary">My Orders</h2>
          <p className="text-muted">Track and manage your orders</p>
        </Col>
      </Row>

      {orders.length === 0 ? (
        <Card className="text-center py-5 border-0 shadow-sm">
          <Card.Body>
            <h4 className="text-muted mb-3">No Orders Found</h4>
            <p className="text-secondary">You haven't placed any orders yet.</p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {orders.map((order) => (
            <Col key={order._id} xs={12} className="mb-4">
              <Card className="border-0 shadow-sm hover-shadow">
                <Card.Header className="bg-white py-3">
                  <Row className="align-items-center">
                    <Col>
                      <h6 className="mb-1 fw-bold">Order #{order._id}</h6>
                      <small className="text-muted">
                        Placed on: {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </small>
                    </Col>
                    <Col xs="auto">
                      <Badge 
                        bg={getStatusBadgeVariant(order.status)}
                        className="px-3 py-2"
                      >
                        {order.status}
                      </Badge>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body className="py-4">
                  {order.items.map((item, index) => (
                    <Row 
                      key={index} 
                      className={`align-items-center ${index !== order.items.length - 1 ? 'mb-3 pb-3 border-bottom' : ''}`}
                    >
                      <Col>
                        <h6 className="mb-1">{item.name}</h6>
                        <Badge bg="light" text="dark" className="px-2">
                          Qty: {item.quantity}
                        </Badge>
                      </Col>
                      <Col xs="auto">
                        <h6 className="mb-0 text-primary">රු{item.price.toFixed(2)}</h6>
                      </Col>
                    </Row>
                  ))}
                  <Row className="mt-4">
                    <Col>
                      <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded">
                        <h6 className="mb-0">Total Amount</h6>
                        <h5 className="mb-0 text-primary">රු{order.totalAmount.toFixed(2)}</h5>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="bg-white border-top-0 py-3">
                  <Row className="align-items-center">
                    <Col>
                      <i className="bi bi-geo-alt text-muted me-2"></i>
                      <span className="text-muted">
                        Delivering to: {order.shippingDetails.address}, {order.shippingDetails.city}
                      </span>
                    </Col>
                  </Row>
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