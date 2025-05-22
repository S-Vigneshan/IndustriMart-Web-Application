import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

import Sidebar from './Sidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaShoppingCart, FaBoxes, FaChartLine,FaSync } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    userCount: 0,
    totalSales: 0,
    productCount: 0,
    orderCount: 0
  });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Check if admin is logged in
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/signin');
      return;
    }
    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Fetch users count with auth header
      const usersResponse = await axios.get('http://localhost:5000/api/admin/users', config);
      const userCount = usersResponse.data.length;

      // Fetch products count with auth header
      const productsResponse = await axios.get('http://localhost:5000/api/admin/products', config);
      const productCount = productsResponse.data.length;

      // Fetch orders with auth header
      const ordersResponse = await axios.get('http://localhost:5000/api/orders', config);
      const ordersData = ordersResponse.data;
      const orderCount = ordersData.length;
      const totalSales = ordersData.reduce((sum, order) => sum + order.totalAmount, 0);

      setOrders(ordersData);
      setStats({
        userCount,
        totalSales,
        productCount,
        orderCount
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        localStorage.removeItem('isAdmin');
        navigate('/admin/signin');
      }
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="dashboard-content flex-grow-1 bg-light min-vh-100">
        <Container fluid className="py-4">
          <Row className="mb-4 align-items-center">
            <Col>
              <h2 className="fw-bold text-dark mb-0">Dashboard Overview</h2>
              <p className="text-muted mb-0">Welcome to your admin dashboard</p>
            </Col>
            <Col xs="auto">
              <Button 
                variant="primary"
                className="d-flex align-items-center gap-2"
                onClick={fetchDashboardStats}
              >
                <FaSync /> Refresh Data
              </Button>
            </Col>
          </Row>
          
          <Row className="g-4">
            <Col md={3}>
              <Card className="dashboard-card h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="stats-icon rounded-circle p-3 bg-primary bg-opacity-10">
                      <FaUsers className="text-primary fs-4" />
                    </div>
                    <div className="ms-3">
                      <h6 className="text-muted mb-1">Total Users</h6>
                      <h3 className="mb-0 fw-bold">{stats.userCount}</h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="dashboard-card h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="stats-icon rounded-circle p-3 bg-success bg-opacity-10">
                      <FaChartLine className="text-success fs-4" />
                    </div>
                    <div className="ms-3">
                      <h6 className="text-muted mb-1">Total Sales</h6>
                      <h3 className="mb-0 fw-bold">රු {stats.totalSales.toLocaleString()}</h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="dashboard-card h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="stats-icon rounded-circle p-3 bg-info bg-opacity-10">
                      <FaBoxes className="text-info fs-4" />
                    </div>
                    <div className="ms-3">
                      <h6 className="text-muted mb-1">Products</h6>
                      <h3 className="mb-0 fw-bold">{stats.productCount}</h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="dashboard-card h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="stats-icon rounded-circle p-3 bg-warning bg-opacity-10">
                      <FaShoppingCart className="text-warning fs-4" />
                    </div>
                    <div className="ms-3">
                      <h6 className="text-muted mb-1">Orders</h6>
                      <h3 className="mb-0 fw-bold">{stats.orderCount}</h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;