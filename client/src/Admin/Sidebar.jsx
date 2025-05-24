import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin/signin');
  };

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <Button
        className="d-md-none position-fixed top-0 start-0 m-2 z-3"
        onClick={toggleSidebar}
        variant="primary"
        style={{ zIndex: 1000 }}
      >
        <i className={`bi bi-${isExpanded ? 'x-lg' : 'list'}`}></i>
      </Button>

      <div className={`sidebar-wrapper position-fixed h-100 ${isExpanded ? 'show' : 'hide'}`}
        style={{
          width: '280px',
          backgroundColor: '#1a237e',
          transform: isExpanded ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          zIndex: 999
        }}>
        <div className="d-flex flex-column h-100">
          <div className="p-4">
            <div className="text-center mb-4">
              <h3 className="text-white fw-bold">
                <i className="bi bi-shield-lock me-2"></i>
                Admin Panel
              </h3>
            </div>
            <hr className="bg-secondary opacity-25" />
            <ul className="nav flex-column gap-2">
              {[
                { path: '/admin/dashboard', icon: 'grid-1x2-fill', label: 'Dashboard' },
                { path: '/admin/users', icon: 'person-fill', label: 'Users' },
                { path: '/admin/products', icon: 'box-seam-fill', label: 'Products' },
                { path: '/admin/categories', icon: 'tags-fill', label: 'Categories' },
                { path: '/admin/orders', icon: 'cart-check-fill', label: 'Orders' },
                { path: '/admin/feedbacks', icon: 'chat-dots-fill', label: 'Feedbacks' },
              ].map((item) => (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                    style={{
                      backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.15)' : 'transparent',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      transition: 'all 0.3s ease',
                      color: '#fff',
                    }}
                    onClick={() => window.innerWidth < 768 && setIsExpanded(false)}
                    onMouseEnter={(e) => {
                      if (!isActive(item.path)) {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item.path)) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span className="icon-container d-inline-flex align-items-center justify-content-center me-3"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        fontSize: '1.2rem'
                      }}>
                      <i className={`bi bi-${item.icon}`}></i>
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 mt-auto">
            <button
              onClick={handleLogout}
              className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2"
              style={{
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: 'none'
              }}
            >
              <i className="bi bi-box-arrow-right"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div
          className="position-fixed d-md-none"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 998
          }}
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
};

export default Sidebar;