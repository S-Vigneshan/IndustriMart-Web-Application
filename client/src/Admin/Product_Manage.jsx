import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';

const Product_Manage = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    allowCustomSize: false,
    defaultSizes: [],
  });
  const [sizeInput, setSizeInput] = useState({ size: '', price: '' });
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error loading categories:', err));
  }, []);

  const handleAddSize = () => {
    if (sizeInput.size && sizeInput.price) {
      setProduct(prev => ({
        ...prev,
        defaultSizes: [...prev.defaultSizes, sizeInput]
      }));
      setSizeInput({ size: '', price: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('category', product.category);
    formData.append('allowCustomSize', product.allowCustomSize);
    formData.append('defaultSizes', JSON.stringify(product.defaultSizes));

    images.forEach(img => formData.append('images', img));

    try {
      await axios.post('http://localhost:5000/api/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Product added successfully!');
      // Clear form after submission
      setProduct({ name: '', description: '', category: '', allowCustomSize: false, defaultSizes: [] });
      setImages([]);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Container className="py-4">
          <h2 className="text-center mb-4">Add Product</h2>
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={product.category}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Allow Custom Size"
                checked={product.allowCustomSize}
                onChange={(e) => setProduct({ ...product, allowCustomSize: e.target.checked })}
              />
            </Form.Group>

            <Row className="mb-3">
              <Col><Form.Control placeholder="Size" value={sizeInput.size} onChange={(e) => setSizeInput({ ...sizeInput, size: e.target.value })} /></Col>
              <Col><Form.Control placeholder="Price" type="number" value={sizeInput.price} onChange={(e) => setSizeInput({ ...sizeInput, price: e.target.value })} /></Col>
              <Col><Button onClick={handleAddSize}>Add Size</Button></Col>
            </Row>

            {product.defaultSizes.map((s, i) => (
              <div key={i}>{s.size} - ${s.price}</div>
            ))}

            <Form.Group className="mb-3">
              <Form.Label>Product Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages([...e.target.files])}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">Save Product</Button>
          </Form>
        </Container>
      </div>
    </div>
  );
};

export default Product_Manage;
