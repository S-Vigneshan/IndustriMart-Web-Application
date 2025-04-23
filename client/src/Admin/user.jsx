import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const data = response.data;
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 bg-light">
        <div className="p-4">
          <h2 className="mb-4">User Management</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact Number</th>
                    <th>Address</th>
                    <th>Registered Date</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
