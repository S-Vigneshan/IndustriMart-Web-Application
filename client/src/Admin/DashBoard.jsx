import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Sidebar from './Sidebar';
import axios from 'axios';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaShoppingCart, FaBoxes, FaChartLine, FaSync } from 'react-icons/fa';

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
        <Container fluid className="p-4">
          {/* Header Section */}
          <Row className="mb-5 align-items-center">
            <Col>
              <h1 className="display-5 fw-bold text-dark mb-2">Dashboard Overview</h1>
              <p className="lead text-muted mb-0">Welcome to your admin dashboard</p>
            </Col>
            <Col xs="auto">
              <Button 
                variant="primary"
                size="lg"
                className="d-flex align-items-center gap-2 px-4"
                onClick={fetchDashboardStats}
              >
                <FaSync /> Refresh Data
              </Button>
            </Col>
          </Row>
          
          {/* Stats Cards */}
          <Row className="g-4 mb-5">
            <Col lg={3} md={6}>
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 stat-card">
                <div className="d-flex align-items-center">
                  <div className="stat-icon bg-primary bg-opacity-10 rounded-4 p-4">
                    <FaUsers className="text-primary" style={{ fontSize: '2rem' }} />
                  </div>
                  <div className="ms-4">
                    <h6 className="text-muted fw-semibold mb-2">Total Users</h6>
                    <h2 className="display-6 fw-bold mb-0">{stats.userCount}</h2>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 stat-card">
                <div className="d-flex align-items-center">
                  <div className="stat-icon bg-success bg-opacity-10 rounded-4 p-4">
                    <FaChartLine className="text-success" style={{ fontSize: '2rem' }} />
                  </div>
                  <div className="ms-4">
                    <h6 className="text-muted fw-semibold mb-2">Total Sales</h6>
                    <h2 className="display-6 fw-bold mb-0">රු {stats.totalSales.toLocaleString()}</h2>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 stat-card">
                <div className="d-flex align-items-center">
                  <div className="stat-icon bg-info bg-opacity-10 rounded-4 p-4">
                    <FaBoxes className="text-info" style={{ fontSize: '2rem' }} />
                  </div>
                  <div className="ms-4">
                    <h6 className="text-muted fw-semibold mb-2">Products</h6>
                    <h2 className="display-6 fw-bold mb-0">{stats.productCount}</h2>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 stat-card">
                <div className="d-flex align-items-center">
                  <div className="stat-icon bg-warning bg-opacity-10 rounded-4 p-4">
                    <FaShoppingCart className="text-warning" style={{ fontSize: '2rem' }} />
                  </div>
                  <div className="ms-4">
                    <h6 className="text-muted fw-semibold mb-2">Orders</h6>
                    <h2 className="display-6 fw-bold mb-0">{stats.orderCount}</h2>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;