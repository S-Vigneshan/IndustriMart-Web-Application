import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FaTrash } from 'react-icons/fa';

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
      <div className="flex-grow-1 bg-light">
        <Container fluid className="py-4">
          <h2 className="mb-4">Customer Feedbacks</h2>
          
          {error && (
            <Alert variant="danger" className="mb-4" dismissible>
              {error}
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              {feedbacks.length === 0 ? (
                <Alert variant="info">No feedbacks found</Alert>
              ) : (
                <Table responsive striped bordered hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Message</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.map((feedback) => (
                      <tr key={feedback._id}>
                        <td>
                          {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td>{feedback.name}</td>
                        <td>{feedback.email}</td>
                        <td>{feedback.message}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(feedback._id)}
                          >
                            <FaTrash /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </>
          )}
        </Container>
      </div>
    </div>
  );
};

export default FeedBacks;