import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from './Sidebar';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editedStatus, setEditedStatus] = useState('');

  // Fetch all orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  // Delete order
  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
        setOrders(orders.filter(order => order._id !== orderId));
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  // Update order status
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${selectedOrder._id}`, {
        status: editedStatus
      });
      setOrders(orders.map(order => 
        order._id === selectedOrder._id 
          ? { ...order, status: editedStatus }
          : order
      ));
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  // Status badge color
  const getStatusBadgeVariant = (status) => {
    const variants = {
      'Pending': 'warning',
      'Processing': 'info',
      'Shipped': 'primary',
      'Delivered': 'success'
    };
    return variants[status] || 'secondary';
  };

  return (
   <div className="d-flex">
    <Sidebar />
    <Container fluid className="py-4">
      <h2 className="mb-4">Order Management</h2>
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Shipping Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.shippingDetails.firstName} {order.shippingDetails.lastName}
                  <br />
                  <small>{order.shippingDetails.email}</small>
                </td>
                <td>රු{order.totalAmount.toFixed(2)}</td>
                <td>
                  <Badge bg={getStatusBadgeVariant(order.status)}>
                    {order.status}
                  </Badge>
                </td>
                <td>
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td>
                  {order.shippingDetails.address}, {order.shippingDetails.city}
                </td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      setSelectedOrder(order);
                      setEditedStatus(order.status);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(order._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Order Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Order Status</Form.Label>
                <Form.Select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Update Status
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default OrderManagement;