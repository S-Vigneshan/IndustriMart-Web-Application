import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Signup.css'; // Import the CSS file for styling
import { FaUser, FaPhone, FaHome, FaEnvelope, FaLock ,FaEye, FaEyeSlash} from 'react-icons/fa'; // Import icons
import { signup } from '../services/authService';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError("");
    setError("");
    setIsLoading(true);

    try {
      const { confirmPassword, ...signupData } = formData;
      await signup(signupData);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="text-center">Sign Up</h2>
        
        {error && <div className="error-message">{error}</div>}

        {/* Name Field */}
        <div className="form-group">
          <label>Name</label>
          <div className="input-icon">
            <FaUser className="icon" /> {/* Name Icon */}
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              required
            />
          </div>
        </div>

        {/* Contact Number Field */}
        <div className="form-group">
          <label>Contact Number</label>
          <div className="input-icon">
            <FaPhone className="icon" /> {/* Contact Icon */}
            <input
              type="tel"
              className="form-control"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter contact number"
              required
            />
          </div>
        </div>

        {/* Address Field */}
        <div className="form-group">
          <label>Address</label>
          <div className="input-icon">
            <FaHome className="icon" /> {/* Address Icon */}
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label>Email</label>
          <div className="input-icon">
            <FaEnvelope className="icon" /> {/* Email Icon */}
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
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
        </div>

        {/* Confirm Password Field */}
        <div className="form-group">
          <label>Confirm Password</label>
          <div className="password-input">
            <div className="input-icon">
              <FaLock className="icon" /> {/* Confirm Password Icon */}
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
            </div>
            <button
              type="button"
              className="toggle-password"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {passwordError && <p className="error-text">{passwordError}</p>}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-block"
          disabled={isLoading}
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>

        <p className="text-center">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;