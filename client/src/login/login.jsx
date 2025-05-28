import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from '../services/authService';
import './login.css';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/'); // Redirect to home page after successful login
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="text-center">Login</h2> {/* Center the heading */}
        <p className="welcome-text text-center">Welcome to our website! Please log in to continue.</p>

        {error && <div className="error-message">{error}</div>}

        {/* Email Field */}
        <div className="form-group">
          <label>Email</label>
          <div className="input-icon">
            <FaEnvelope className="icon" /> {/* Email Icon */}
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label>Password</label>
          <div className="password-input">
            <div className="input-icon">
              <FaLock className="icon" /> {/* Password Icon */}
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password?
          </Link>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-block d-block mx-auto"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;