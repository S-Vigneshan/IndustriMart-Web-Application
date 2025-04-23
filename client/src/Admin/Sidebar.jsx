import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin/signin');
  };

  return (
    <div className="bg-primary min-vh-100 text-white" style={{width: '250px'}}>
      <div className="p-4">
        <h4 className="text-white">Admin Panel</h4>
        <hr className="bg-white" />
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/admin/dashboard" className="nav-link text-white">
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/users" className="nav-link text-white">
              <i className="bi bi-people me-2"></i>Users
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/products" className="nav-link text-white">
              <i className="bi bi-box me-2"></i>Products
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/settings" className="nav-link text-white">
              <i className="bi bi-gear me-2"></i>Settings
            </Link>
          </li>
          <li className="nav-item mt-auto">
            <button 
              onClick={handleLogout}
              className="nav-link text-white btn btn-link"
            >
              <i className="bi bi-box-arrow-right me-2"></i>Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
