import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
//import './profile.css';

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
    } catch (err) {
      setError('Failed to fetch profile data');
    }
  }, [token]); // Add token as dependency

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]); // Add fetchUserProfile as dependency

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

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {!isEditing ? (
        <div className="profile-info">
          <div className="info-group">
            <label>Name:</label>
            <p>{user.name}</p>
          </div>
          <div className="info-group">
            <label>Email:</label>
            <p>{user.email}</p>
          </div>
          <div className="info-group">
            <label>Contact Number:</label>
            <p>{user.contactNumber}</p>
          </div>
          <div className="info-group">
            <label>Address:</label>
            <p>{user.address}</p>
          </div>
          
          <div className="button-group">
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Edit Profile
            </button>
            <button onClick={handleDelete} className="delete-btn">
              Delete Account
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="edit-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Contact Number:</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="button-group">
            <button type="submit" className="save-btn">
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
