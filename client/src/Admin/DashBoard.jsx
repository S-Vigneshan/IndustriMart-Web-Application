import React, { useState, useEffect, useCallback} from 'react';
import { Container,  Button } from 'react-bootstrap';
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

  const fetchDashboardStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const [usersResponse, productsResponse, ordersResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users', config),
        axios.get('http://localhost:5000/api/admin/products', config),
        axios.get('http://localhost:5000/api/orders', config)
      ]);

      const userCount = usersResponse.data.length;
      const productCount = productsResponse.data.length;
      const orderCount = ordersResponse.data.length;
      const totalSales = ordersResponse.data.reduce((sum, order) => sum + order.totalAmount, 0);

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
  }, [navigate]);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/signin');
      return;
    }
    fetchDashboardStats();
  }, [navigate, fetchDashboardStats]);

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="dashboard-content flex-grow-1">
        <Container fluid className="p-0">
          <div className="header-section">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="display-6 fw-bold text-dark mb-2">Dashboard Overview</h1>
                <p className="text-muted mb-0">Welcome back to your admin dashboard</p>
              </div>
              <Button 
                variant="primary"
                className="refresh-btn d-flex align-items-center gap-2"
                onClick={fetchDashboardStats}
              >
                <FaSync /> Refresh Data
              </Button>
            </div>
          </div>

          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-icon bg-primary bg-opacity-10">
                <FaUsers className="text-primary" style={{ fontSize: '1.75rem' }} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Users</div>
                <div className="stat-value">{stats.userCount.toLocaleString()}</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon bg-success bg-opacity-10">
                <FaChartLine className="text-success" style={{ fontSize: '1.75rem' }} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Revenue</div>
                <div className="sales-value">
                  රු {Number(stats.totalSales).toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  })}
                </div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon bg-info bg-opacity-10">
                <FaBoxes className="text-info" style={{ fontSize: '1.75rem' }} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Products</div>
                <div className="stat-value">{stats.productCount.toLocaleString()}</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon bg-warning bg-opacity-10">
                <FaShoppingCart className="text-warning" style={{ fontSize: '1.75rem' }} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Orders</div>
                <div className="stat-value">{stats.orderCount.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;