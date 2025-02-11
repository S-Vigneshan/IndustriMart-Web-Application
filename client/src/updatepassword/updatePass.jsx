import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaLock, FaKey, FaShieldAlt } from 'react-icons/fa';
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
          <Col md={10} lg={8}>
            <div className="text-center mb-4">
              <FaShieldAlt size={40} className="text-primary mb-3" />
              <h2>Update Password</h2>
            </div>
              
            {error && (
              <Alert variant="danger" className="d-flex align-items-center">
                <FaLock className="me-2" /> {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" className="d-flex align-items-center">
                <FaKey className="me-2" /> {success}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} className="py-3">
              <Form.Group className="mb-4">
                <Form.Label className="fs-5">New Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaLock className="text-primary" />
                  </span>
                  <Form.Control
                    type={showPassword.new ? "text" : "password"}
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className="py-2"
                    required
                    style={{ paddingRight: '40px' }}
                  />
                  <span 
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: '9',
                      cursor: 'pointer'
                    }}
                    onClick={() => togglePasswordVisibility('new')}
                    className="text-secondary"
                  >
                    {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <Form.Text className="text-muted">
                  Password must be at least 6 characters long
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fs-5">Confirm Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaKey className="text-primary" />
                  </span>
                  <Form.Control
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    className="py-2"
                    required
                    style={{ paddingRight: '40px' }}
                  />
                  <span 
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: '9',
                      cursor: 'pointer'
                    }}
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="text-secondary"
                  >
                    {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>

              <Button 
                type="submit" 
                variant="primary" 
                size="lg"
                className="w-100 mt-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <FaShieldAlt className="me-2" />
                    Update Password
                  </>
                )}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default UpdatePassword;