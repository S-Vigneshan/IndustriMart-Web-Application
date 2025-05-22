import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Badge, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FaBox, FaMapMarkerAlt, FaCalendarAlt, FaTruck } from 'react-icons/fa';
import { getToken } from '../services/authService';
import './myOrder.css';

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
    <Container className="d-flex justify-content-center align-items-center min-vh-60">
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
      <div className="orders-header mb-5">
        <h2 className="display-6 fw-bold text-primary mb-2">My Orders</h2>
        <div className="progress-summary d-flex gap-4 mt-4">
          <div className="status-box">
            <FaBox className="icon" />
            <span>Total Orders</span>
            <h4>{orders.length}</h4>
          </div>
          <div className="status-box">
            <FaTruck className="icon" />
            <span>In Transit</span>
            <h4>{orders.filter(order => order.status === 'Shipped').length}</h4>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state text-center py-5">
          <FaBox size={48} className="text-muted mb-3" />
          <h4 className="text-muted mb-3">No Orders Found</h4>
          <p className="text-secondary">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-item mb-4">
              <div className="order-header p-4 bg-white rounded-top border-bottom">
                <Row className="align-items-center">
                  <Col>
                    <h6 className="order-id mb-1">Order #{order._id}</h6>
                    <div className="text-muted d-flex align-items-center">
                      <FaCalendarAlt className="me-2" />
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </Col>
                  <Col xs="auto">
                    <Badge 
                      bg={getStatusBadgeVariant(order.status)}
                      className="status-badge"
                    >
                      {order.status}
                    </Badge>
                  </Col>
                </Row>
              </div>

              <div className="order-body p-4 bg-white">
                {order.items.map((item, index) => (
                  <div 
                    key={index} 
                    className={`order-product ${
                      index !== order.items.length - 1 ? 'mb-3 pb-3 border-bottom' : ''
                    }`}
                  >
                    <Row className="align-items-center">
                      <Col>
                        <h6 className="mb-1">{item.name}</h6>
                        <span className="quantity-badge">
                          Qty: {item.quantity}
                        </span>
                      </Col>
                      <Col xs="auto">
                        <div className="price">රු{item.price.toFixed(2)}</div>
                      </Col>
                    </Row>
                  </div>
                ))}

                <div className="order-total mt-4 p-3 bg-light rounded">
                  <Row className="align-items-center">
                    <Col>
                      <h6 className="mb-0">Total Amount</h6>
                    </Col>
                    <Col xs="auto">
                      <h5 className="mb-0 text-primary">රු{order.totalAmount.toFixed(2)}</h5>
                    </Col>
                  </Row>
                </div>
              </div>

              <div className="order-footer p-4 bg-white rounded-bottom">
                <div className="d-flex align-items-center text-muted">
                  <FaMapMarkerAlt className="me-2" />
                  Delivering to: {order.shippingDetails.address}, {order.shippingDetails.city}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default MyOrder;