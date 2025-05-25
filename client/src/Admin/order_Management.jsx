import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FaShoppingBag, FaEdit, FaTrash, FaSync, FaBoxOpen } from 'react-icons/fa';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editedStatus, setEditedStatus] = useState('');
  const [editedPaymentStatus, setEditedPaymentStatus] = useState('');

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

  const handleUpdate = async () => {
  try {
    await axios.put(`http://localhost:5000/api/orders/${selectedOrder._id}`, {
      status: editedStatus,
      payment: {
        ...selectedOrder.payment,
        status: editedPaymentStatus
      }
    });
    
    setOrders(orders.map(order => 
      order._id === selectedOrder._id 
        ? { 
            ...order, 
            status: editedStatus,
            payment: {
              ...order.payment,
              status: editedPaymentStatus
            }
          }
        : order
    ));
    setShowEditModal(false);
  } catch (error) {
    console.error('Error updating order:', error);
  }
};

  const getStatusBadgeVariant = (status) => {
    const variants = {
      'Pending': 'warning',
      'Processing': 'info',
      'Shipped': 'primary',
      'Delivered': 'success',
      
    };
    return variants[status] || 'secondary';
  };

  const getPaymentMethodBadgeVariant = (method) => {
    return method === 'COD' ? 'warning' : 'info';
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
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
                  <FaShoppingBag className="text-primary" />
                  Order Management
                </h2>
                <p className="text-muted mb-0">Manage and track your orders</p>
              </div>
              <Button 
                onClick={fetchOrders}
                style={{
                  backgroundColor: '#1a237e',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem'
                }}
                className="d-flex align-items-center gap-2"
              >
                <FaSync /> Refresh Orders
              </Button>
            </div>
          </div>

          {/* Orders Table Section */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            {loading ? (
              <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover style={{ margin: 0 }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ padding: '1rem' }}>Order ID</th>
                      <th style={{ padding: '1rem' }}>Customer</th>
                      <th style={{ padding: '1rem' }}>Total Amount</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                      <th style={{ padding: '1rem' }}>Payment Method</th>
                      <th style={{ padding: '1rem' }}>Date</th>
                      <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td style={{ padding: '1rem', verticalAlign: 'middle' }}>{order._id}</td>
                        <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                          <div style={{ fontWeight: '500' }}>
                            {order.shippingDetails.firstName} {order.shippingDetails.lastName}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                            {order.shippingDetails.email}
                          </div>
                        </td>
                        <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                          රු{order.totalAmount.toFixed(2)}
                        </td>
                        <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                          <Badge bg={getStatusBadgeVariant(order.status)} 
                                style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}>
                            {order.status}
                          </Badge>
                        </td>
                        <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                          <Badge bg={getPaymentMethodBadgeVariant(order.payment?.method)}
                                style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}>
                            {order.payment?.method === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                          </Badge>
                          
                        </td>
                        <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td style={{ padding: '1rem', verticalAlign: 'middle', minWidth: '120px' }}>
                          <div className="d-flex flex-column gap-2">
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => handleViewDetails(order)}
                              style={{
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem'
                              }}
                            >
                              <FaBoxOpen /> View Details
                            </Button>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setEditedStatus(order.status);
                                setEditedPaymentStatus(order.payment?.status || 'Pending');
                                setShowEditModal(true);
                              }}
                              style={{
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem'
                              }}
                            >
                              <FaEdit /> Edit Status
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(order._id)}
                              style={{
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem'
                              }}
                            >
                              <FaTrash /> Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>

          {/* Edit Status Modal */}
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
  <Modal.Header closeButton style={{ background: '#f8f9fa', border: 'none' }}>
    <Modal.Title className="d-flex align-items-center gap-2">
      <FaEdit className="text-primary" />
      Update Order Status
    </Modal.Title>
  </Modal.Header>
  <Modal.Body style={{ padding: '2rem' }}>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Order Status</Form.Label>
        <Form.Select
          value={editedStatus}
          onChange={(e) => setEditedStatus(e.target.value)}
          style={{ borderRadius: '8px', padding: '0.75rem' }}
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </Form.Select>
      </Form.Group>

      {/* Only show payment status update for COD orders */}
      {selectedOrder?.payment?.method === 'COD' && (
        <Form.Group>
          <Form.Label>Payment Status</Form.Label>
          <Form.Select
            value={editedPaymentStatus}
            onChange={(e) => setEditedPaymentStatus(e.target.value)}
            style={{ borderRadius: '8px', padding: '0.75rem' }}
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </Form.Select>
        </Form.Group>
      )}
    </Form>
  </Modal.Body>
  <Modal.Footer style={{ border: 'none', padding: '1rem 2rem 2rem' }}>
    <Button 
      variant="light" 
      onClick={() => setShowEditModal(false)}
      style={{ borderRadius: '8px' }}
    >
      Cancel
    </Button>
    <Button 
      variant="primary" 
      onClick={handleUpdate}
      style={{
        backgroundColor: '#1a237e',
        border: 'none',
        borderRadius: '8px'
      }}
    >
      Update Status
    </Button>
  </Modal.Footer>
</Modal>

          {/* Order Details Modal */}
          <Modal 
            show={showDetailsModal} 
            onHide={() => setShowDetailsModal(false)}
            size="lg"
          >
            <Modal.Header closeButton style={{ background: '#f8f9fa', border: 'none' }}>
              <Modal.Title className="d-flex align-items-center gap-2">
                <FaBoxOpen className="text-primary" />
                Order Details
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: '2rem' }}>
              {selectedOrder && (
                <>
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <h6 className="mb-2">Order ID: {selectedOrder._id}</h6>
                      <p className="mb-0 text-muted">
                        Placed on: {new Date(selectedOrder.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-end">
                      <Badge bg={getStatusBadgeVariant(selectedOrder.status)}
                            style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h6 className="mb-3">Payment Information</h6>
                    <div className="d-flex gap-3">
                      <Badge bg={getPaymentMethodBadgeVariant(selectedOrder.payment?.method)}
                            style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}>
                        {selectedOrder.payment?.method === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                      </Badge>
                      <Badge bg={selectedOrder.payment?.status === 'Completed' ? 'success' : 'warning'}
                            style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}>
                        {selectedOrder.payment?.status || 'Pending'}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h6 className="mb-3">Order Items</h6>
                    <Table responsive bordered hover>
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>Size</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.variation?.size || 'N/A'}</td>
                            <td>{item.quantity}</td>
                            <td>රු {item.price.toFixed(2)}</td>
                            <td>රු {(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                        <tr className="table-light">
                          <td colSpan="4" className="text-end fw-bold">Total Amount:</td>
                          <td className="fw-bold">රු {selectedOrder.totalAmount.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="mb-3">Customer Details</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Name:</strong> {selectedOrder.shippingDetails.firstName} {selectedOrder.shippingDetails.lastName}</p>
                        <p className="mb-1"><strong>Email:</strong> {selectedOrder.shippingDetails.email}</p>
                        <p className="mb-1"><strong>Phone:</strong> {selectedOrder.shippingDetails.phone}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Address:</strong> {selectedOrder.shippingDetails.address}</p>
                        <p className="mb-1"><strong>City:</strong> {selectedOrder.shippingDetails.city}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Modal.Body>
            <Modal.Footer style={{ border: 'none', padding: '1rem 2rem 2rem' }}>
              <Button 
                variant="primary" 
                onClick={() => setShowDetailsModal(false)}
                style={{
                  backgroundColor: '#1a237e',
                  border: 'none',
                  borderRadius: '8px'
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </div>
  );
};

export default OrderManagement;