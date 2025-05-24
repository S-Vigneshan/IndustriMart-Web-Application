import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Alert, Container } from 'react-bootstrap';
import Sidebar from './Sidebar';
import axios from 'axios';
import { FaEdit, FaTrash, FaUserCog } from 'react-icons/fa';

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    contactNumber: '',
    address: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      contactNumber: user.contactNumber,
      address: user.address
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${selectedUser._id}`,
        editForm,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setShowEditModal(false);
      setAlert({
        show: true,
        message: 'User updated successfully',
        variant: 'success'
      });
      fetchUsers();
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.message || 'Error updating user',
        variant: 'danger'
      });
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setAlert({
          show: true,
          message: 'User deleted successfully',
          variant: 'success'
        });
        fetchUsers();
      } catch (error) {
        setAlert({
          show: true,
          message: error.response?.data?.message || 'Error deleting user',
          variant: 'danger'
        });
      }
    }
  };

   return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 min-vh-100" style={{ marginLeft: window.innerWidth >= 768 ? '280px' : '0', transition: 'margin-left 0.3s ease-in-out', background: '#f8f9fa' }}>
        <Container fluid className="p-4">
          {/* Header Section */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1 d-flex align-items-center gap-2">
                  <FaUserCog className="text-primary" />
                  User Management
                </h2>
                <p className="text-muted mb-0">Manage your system users</p>
              </div>
            </div>
          </div>

          {/* Alert Section */}
          {alert.show && (
            <Alert 
              variant={alert.variant} 
              onClose={() => setAlert({ ...alert, show: false })} 
              dismissible
              style={{ borderRadius: '12px' }}
            >
              {alert.message}
            </Alert>
          )}

          {/* Loading and Table Section */}
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Contact Number</th>
                      <th scope="col">Address</th>
                      <th scope="col">Registered Date</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.contactNumber}</td>
                        <td>{user.address}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            style={{ borderRadius: '8px' }}
                            onClick={() => handleEdit(user)}
                          >
                            <FaEdit /> Edit
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            style={{ borderRadius: '8px' }}
                            onClick={() => handleDelete(user._id)}
                          >
                            <FaTrash /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Container>
      </div>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton style={{ background: '#f8f9fa' }}>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                value={editForm.contactNumber}
                onChange={(e) => setEditForm({...editForm, contactNumber: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.address}
                onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="light" 
                onClick={() => setShowEditModal(false)}
                style={{ borderRadius: '8px' }}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                style={{ borderRadius: '8px', backgroundColor: '#1a237e', border: 'none' }}
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default User;