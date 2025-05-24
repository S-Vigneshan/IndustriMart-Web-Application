import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FaTrash, FaComments, FaSync } from 'react-icons/fa';

const FeedBacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contact', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFeedbacks(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch feedbacks');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await axios.delete(`http://localhost:5000/api/contact/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete feedback');
      }
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{
        marginLeft: window.innerWidth >= 768 ? '280px' : '0',
        transition: 'margin-left 0.3s ease-in-out',
        background: '#f8f9fa',
        minHeight: '100vh'
      }}>
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
                  <FaComments className="text-primary" />
                  Customer Feedbacks
                </h2>
                <p className="text-muted mb-0">View and manage customer messages</p>
              </div>
              <Button 
                onClick={fetchFeedbacks}
                style={{
                  backgroundColor: '#1a237e',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem'
                }}
                className="d-flex align-items-center gap-2"
              >
                <FaSync /> Refresh
              </Button>
            </div>
          </div>

          {error && (
            <Alert 
              variant="danger" 
              className="mb-4" 
              dismissible
              style={{
                borderRadius: '8px',
                border: 'none'
              }}
            >
              {error}
            </Alert>
          )}

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <>
                {feedbacks.length === 0 ? (
                  <Alert 
                    variant="info" 
                    style={{
                      borderRadius: '8px',
                      border: 'none',
                      margin: 0
                    }}
                  >
                    No feedbacks found
                  </Alert>
                ) : (
                  <div className="table-responsive">
                    <Table hover style={{ margin: 0 }}>
                      <thead>
                        <tr style={{ background: '#f8f9fa' }}>
                          <th style={{ padding: '1rem' }}>Date</th>
                          <th style={{ padding: '1rem' }}>Name</th>
                          <th style={{ padding: '1rem' }}>Email</th>
                          <th style={{ padding: '1rem' }}>Message</th>
                          <th style={{ padding: '1rem', width: '100px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feedbacks.map((feedback) => (
                          <tr key={feedback._id}>
                            <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                              {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                              <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                                {new Date(feedback.createdAt).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </td>
                            <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                              {feedback.name}
                            </td>
                            <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                              {feedback.email}
                            </td>
                            <td style={{ 
                              padding: '1rem', 
                              verticalAlign: 'middle',
                              maxWidth: '300px',
                              whiteSpace: 'pre-wrap'
                            }}>
                              {feedback.message}
                            </td>
                            <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                style={{
                                  borderRadius: '8px',
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.5rem'
                                }}
                                onClick={() => handleDelete(feedback._id)}
                              >
                                <FaTrash /> Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default FeedBacks;