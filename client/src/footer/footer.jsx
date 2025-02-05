import React from "react";
import "./footer.css";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Quick Links */}
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="/shop">Shop</a>
            </li>
            <li>
              <a href="/support">Support</a>
            </li>
            <li>
              <a href="/policy">Policy</a>
            </li>
            <li>
              <a href="/faq">FAQ</a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>
            <FaEnvelope className="icon" />{" "}
            <a href="mailto:contact@industrimart.com">contact@industrimart.com</a>
          </p>
          <p>
            <FaPhone className="icon" /> +94 123 456 789
          </p>
          <p>
            <FaMapMarkerAlt className="icon" /> Colombo, Sri Lanka
          </p>
        </div>

        {/* Newsletter Signup */}
        <div className="footer-section newsletter">
          <h3>Stay Connected</h3>
          <form>
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Newsletter Email"
              required
            />
            <button type="submit" className="subscribe-btn">
              Subscribe
            </button>
          </form>
          <div className="social-media">
            <a
              href="https://facebook.com"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 IndustriMart. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
