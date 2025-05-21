import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './navbar.css';
import logo from '../assets/image/logo.avif'; // Updated import path to be within src directory
import { CartContext } from '../context/CartContext'; // Import Cart Context to get cartItems
import { getUsername, isAuthenticated, logout } from '../services/authService';

const Navbar = () => {
  const location = useLocation(); // Helps with the active class
  const { cartItems } = useContext(CartContext); // Get cart items from context
  const username = getUsername();
  const authenticated = isAuthenticated();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-blue">
      {/* Brand Logo */}
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <img src={logo} alt="Industrimart Logo" className="logo" style={{ width: '30px', height: '30px' }} />
        <span className="ml-2">Industrimart </span>
      </Link>

      {/* Mobile toggle button */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse" // Bootstrap 5 uses "data-bs-toggle"
        data-bs-target="#navbarNav" // Bootstrap 5 uses "data-bs-target"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          {/* Dynamic active class based on location */}
          <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/shop' ? 'active' : ''}`}>
            <Link className="nav-link" to="/shop">Shop</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}>
            <Link className="nav-link" to="/about">About Us</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/contact' ? 'active' : ''}`}>
            <Link className="nav-link" to="/contact">Contact Us</Link>
          </li>
        </ul>

        {/* Cart and User section on the right */}
        <ul className="navbar-nav ml-auto">
          {/* Cart Icon */}
          <li className="nav-item">
            <Link className="nav-link" to="/cart">
              <FaShoppingCart size={20} />
              {/* Only show cart count if there are items in the cart */}
              {cartItems.length > 0 && (
                <span className="cart-count">{cartItems.length}</span>
              )}
            </Link>
          </li>

          {/* User section with dropdown */}
          {authenticated ? (
            <li className="nav-item dropdown">
              <div 
                className="nav-link dropdown-toggle user-profile"
                onClick={toggleDropdown}
              >
                <FaUserCircle size={25} />
                <span className="ml-2">{username}</span>
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu show">
                  <Link 
                    className="dropdown-item" 
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FaUserCircle className="dropdown-icon" />
                    My Profile
                  </Link>
                  <Link 
                    className="dropdown-item" 
                    to="/my-orders"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FaShoppingCart className="dropdown-icon" />
                    My Orders
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item" 
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="dropdown-icon" />
                    Logout
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                <FaUserCircle size={25} />
                <span className="ml-2">Login</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
