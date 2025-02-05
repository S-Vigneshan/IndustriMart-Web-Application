import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/update-password', 
        { password: passwords.newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      
      setSuccess(data.message || 'Password updated successfully');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
    setLoading(false);
  };

  return (
    <Container fluid className="min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <h2 className="text-center mb-4">Update Password</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>New Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword.new ? "text" : "password"}
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    required
                  />
                  <Button
                    variant="link"
                    className="position-absolute end-0 top-50 translate-middle-y"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirm Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    required
                  />
                  <Button
                    variant="link"
                    className="position-absolute end-0 top-50 translate-middle-y"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
              </Form.Group>

              <Button 
                type="submit" 
                variant="primary" 
                className="w-100"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default UpdatePassword;