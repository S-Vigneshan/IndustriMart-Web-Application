import React, { useContext, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, calculateTotal } = useContext(CartContext);
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        items: cartItems,
        shippingDetails,
        totalAmount: calculateTotal(),
        userId: 'current-user-id' // Replace with actual user ID from auth context
      };

      const response = await axios.post('/api/orders', orderData);
      console.log('Order created:', response.data);
      // Handle successful order creation (redirect to confirmation page, etc.)
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <Container className="checkout-page py-5">
      <Row>
        <Col md={7}>
          <h2>Shipping Details</h2>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={shippingDetails.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={shippingDetails.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={shippingDetails.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={shippingDetails.phone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={shippingDetails.address}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={shippingDetails.city}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary">Place Order</Button>
          </Form>
        </Col>

        <Col md={5}>
          <div className="order-summary">
            <h2>Order Summary</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-details">
                  <h5>{item.name}</h5>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: රු. {item.variation.price}</p>
                  <p>Subtotal: රු. {(item.variation.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
            <div className="total-amount">
              <h4>Total Amount: රු. {calculateTotal()}</h4>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;