import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaEnvelope, FaKey } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/send-otp', { email });
      setOtpSent(true);
      setSuccess(data.message || 'OTP sent successfully to your email!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
      setOtpSent(false);
    }
    setLoading(false);
  };
  
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/verify-otp', { 
        email, 
        otp 
      });
      setSuccess(data.message || 'OTP verified successfully!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Container fluid className="min-vh-100 py-4">
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <h2 className="text-center mb-4">Forgot Password</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
  
            <Form>
              <Form.Group className="mb-4">
                <Form.Label>Email address</Form.Label>
                <div className="d-flex gap-2 align-items-center">
                <div style={{ width: '75%' }}>
                    <div className="input-group">
                    <span className="input-group-text">
                        <FaEnvelope />
                    </span>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={otpSent}
                        className="py-2"
                    />
                    </div>
                </div>
                <Button 
                    variant="primary"
                    onClick={handleSendOTP}
                    disabled={loading || otpSent || !email}
                    style={{ width: '25%', minWidth: '80px' }}
                    className="py-2"
                >
                    {loading ? 'Send' : 'Send'}
                </Button>
                </div>
              </Form.Group>
  
              <Form.Group className="mb-4">
                <Form.Label>OTP Verification</Form.Label>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <FaKey />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Enter OTP code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={!otpSent}
                  />
                </div>
                <Button 
                  variant="success"
                  className="w-100"
                  onClick={handleVerifyOTP}
                  disabled={loading || !otpSent || !otp}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </Container>
  )};

export default ForgotPassword;