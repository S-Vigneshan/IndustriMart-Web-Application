import React, { useState } from 'react';
import axios from 'axios';
import { Alert } from 'react-bootstrap';
import './contact.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [alert, setAlert] = useState({
    show: false,
    variant: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      
      setAlert({
        show: true,
        variant: 'success',
        message: response.data.message
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      setAlert({
        show: true,
        variant: 'danger',
        message: error.response?.data?.message || 'Error sending message'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <header className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Reach out to us using the form below.</p>
      </header>

      <section className="contact-form-section">
        <h2>Get in Touch</h2>
        
        {alert.show && (
          <Alert 
            variant={alert.variant} 
            onClose={() => setAlert({ ...alert, show: false })} 
            dismissible
          >
            {alert.message}
          </Alert>
        )}

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </section>

      {/* Contact Info Section */}
      <section className="contact-info-section">
        <h2>Our Location</h2>
        <p>IndustriMart is located at:</p>
        <p>123 Industrial Avenue, Colombo, Sri Lanka</p>
      </section>

      {/* Google Map */}
      <section className="contact-map">
        <iframe
          title="Google Maps"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126466.73097149033!2d79.9580305!3d6.9270792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259b68b8f222b%3A0x66bcf4187fcf3783!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1634654528770!5m2!1sen!2sus"
          width="100%"
          height="400"
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen=""
          aria-hidden="false"
          tabIndex="0"
        ></iframe>
      </section>

      
      
    </div>
  );
};

export default ContactPage;
