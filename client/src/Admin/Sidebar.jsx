import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';


const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin/signin');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-vh-100 text-white" style={{width: '280px', backgroundColor: '#1a237e'}}>
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
            { path: '/admin/orders', icon: 'cart-check-fill', label: 'Orders' }, // Add this line

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
  );
};

export default Sidebar;
