import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaUser, FaPhone, FaMapMarkerAlt, FaEdit, FaTrash } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setFormData({
        name: response.data.name,
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
    <Container fluid className="py-5 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div className="bg-white shadow-sm rounded-3 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-primary p-4 text-white">
                <div className="text-center mb-3">
                  <div className="bg-white rounded-circle mx-auto d-flex align-items-center justify-content-center" 
                       style={{ width: '120px', height: '120px' }}>
                    <FaUser size={50} className="text-primary" />
                  </div>
                </div>
                <h2 className="text-center mb-0">{user?.name}</h2>
                <p className="text-center mb-0 text-white-50">{user?.email}</p>
              </div>

              {/* Profile Content */}
              <div className="p-4">
                {!isEditing ? (
                  <div>
                    <div className="border-bottom pb-3 mb-3">
                      <h4 className="mb-4">Personal Information</h4>
                      <Row className="mb-3">
                        <Col md={6}>
                          <div className="d-flex align-items-center mb-3">
                            <FaUser className="text-primary me-2" />
                            <div>
                              <small className="text-muted">Name</small>
                              <p className="mb-0">{user?.name}</p>
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="d-flex align-items-center mb-3">
                            <FaPhone className="text-primary me-2" />
                            <div>
                              <small className="text-muted">Contact Number</small>
                              <p className="mb-0">{user?.contactNumber}</p>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <div className="d-flex align-items-start">
                        <FaMapMarkerAlt className="text-primary me-2 mt-1" />
                        <div>
                          <small className="text-muted">Address</small>
                          <p className="mb-0">{user?.address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <Button 
                        variant="primary" 
                        onClick={() => setIsEditing(true)}
                        className="d-flex align-items-center"
                      >
                        <FaEdit className="me-2" /> Edit Profile
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        onClick={handleDelete}
                        className="d-flex align-items-center"
                      >
                        <FaTrash className="me-2" /> Delete Account
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Form onSubmit={handleUpdate} className="py-3">
                    <h4 className="mb-4">Edit Profile</h4>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Contact Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-4">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <div className="d-flex gap-2">
                      <Button type="submit" variant="primary">
                        Save Changes
                      </Button>
                      <Button 
                        type="button" 
                        variant="light"
                        onClick={() => setIsEditing(false)}
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