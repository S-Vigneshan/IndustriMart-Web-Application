import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaUser, FaPhone, FaMapMarkerAlt, FaEdit, FaTrash, FaEnvelope, FaKey } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const token = localStorage.getItem('token');

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        contactNumber: response.data.contactNumber,
        address: response.data.address
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch profile data');
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        'http://localhost:5000/api/profile',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUser(response.data.user);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    try {
      await axios.put(
        'http://localhost:5000/api/profile/password',
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSuccess('Password updated successfully!');
      setShowPasswordSection(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await axios.delete('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.removeItem('token');
        window.location.href = '/login';
      } catch (err) {
        setError('Failed to delete account');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </Container>
  );

  return (
    <Container fluid className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div className="bg-white shadow rounded-3 overflow-hidden">
              {/* Profile Header */}
              <div className="p-4 text-white" style={{ background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)' }}>
                <div className="text-center mb-3">
                  <div className="bg-white rounded-circle mx-auto d-flex align-items-center justify-content-center shadow" 
                       style={{ width: '120px', height: '120px' }}>
                    <FaUser size={50} style={{ color: '#1565c0' }} />
                  </div>
                </div>
                <h2 className="text-center mb-1 - text-white">{user?.name}</h2>
                <p className="text-center mb-0 opacity-75 text-white">{user?.email}</p>
              </div>

              {/* Profile Content */}
              <div className="p-4">
                {!isEditing ? (
                  <div>
                    <div className="border-bottom pb-3 mb-3">
                      <h4 className="mb-4 text-dark">Personal Information</h4>
                      <Row className="mb-3">
                        <Col md={6}>
                          <div className="d-flex align-items-center mb-3">
                            <FaUser className="text-primary me-3" size={20} />
                            <div>
                              <small className="text-muted text-uppercase">Name</small>
                              <p className="mb-0 fw-medium">{user?.name}</p>
                            </div>
                          </div>
                          <div className="d-flex align-items-center mb-3">
                            <FaEnvelope className="text-primary me-3" size={20} />
                            <div>
                              <small className="text-muted text-uppercase">Email</small>
                              <p className="mb-0 fw-medium">{user?.email}</p>
                            </div>
                          </div>
                        </Col>
                        <Col md={12}>
                          <div className="d-flex align-items-start mb-3">
                            <FaMapMarkerAlt className="text-primary me-3 mt-1" size={20} />
                            <div>
                              <small className="text-muted text-uppercase">Address</small>
                              <p className="mb-0 fw-medium">{user?.address}</p>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <FaPhone className="text-primary me-3" size={20} />
                            <div>
                              <small className="text-muted text-uppercase">Contact Number</small>
                              <p className="mb-0 fw-medium">{user?.contactNumber}</p>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    {/* Add Password Update Section */}
                    {showPasswordSection && (
                      <div className="border-top pt-3 mt-3">
                        <h5 className="mb-3">Change Password</h5>
                        <Form onSubmit={handlePasswordUpdate}>
                          <Row>
                            <Col md={12}>
                              <Form.Group className="mb-3">
                                <Form.Label>Current Password</Form.Label>
                                <Form.Control
                                  type="password"
                                  name="currentPassword"
                                  value={formData.currentPassword}
                                  onChange={handleInputChange}
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                  type="password"
                                  name="newPassword"
                                  value={formData.newPassword}
                                  onChange={handleInputChange}
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Confirm New Password</Form.Label>
                                <Form.Control
                                  type="password"
                                  name="confirmPassword"
                                  value={formData.confirmPassword}
                                  onChange={handleInputChange}
                                  required
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <div className="d-flex gap-2">
                            <Button type="submit" variant="primary">
                              Update Password
                            </Button>
                            <Button 
                              type="button" 
                              variant="light"
                              onClick={() => setShowPasswordSection(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </Form>
                      </div>
                    )}

                    <div className="d-flex gap-2 mt-4">
                      <Button 
                        variant="primary" 
                        onClick={() => setIsEditing(true)}
                        className="d-flex align-items-center px-4 py-2"
                      >
                        <FaEdit className="me-2" /> Edit Profile
                      </Button>
                      <Button 
                        variant="outline-primary" 
                        onClick={() => setShowPasswordSection(!showPasswordSection)}
                        className="d-flex align-items-center px-4 py-2"
                      >
                        <FaKey className="me-2" /> Change Password
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        onClick={handleDelete}
                        className="d-flex align-items-center px-4 py-2"
                      >
                        <FaTrash className="me-2" /> Delete Account
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Form onSubmit={handleUpdate} className="py-3">
                    <h4 className="mb-4">Edit Profile</h4>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-control-lg"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="form-control-lg"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Contact Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className="form-control-lg"
                      />
                    </Form.Group>

                    <div className="d-flex gap-2">
                      <Button type="submit" variant="primary" size="lg" className="px-4">
                        Save Changes
                      </Button>
                      <Button 
                        type="button" 
                        variant="light"
                        size="lg"
                        onClick={() => setIsEditing(false)}
                        className="px-4"
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Profile;