import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Row, Col, Table, Modal } from 'react-bootstrap';
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
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProducts();
    axios.get('http://localhost:5000/api/admin/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error loading categories:', err));
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleAddSize = () => {
    if (sizeInput.size && sizeInput.price) {
      setProduct(prev => ({
        ...prev,
        defaultSizes: [...prev.defaultSizes, sizeInput]
      }));
      setSizeInput({ size: '', price: '' });
    }
  };

  const handleEdit = (product) => {
    if (!product || !product._id) {
      console.error('Invalid product data');
      return;
    }

    const productData = {
      _id: product._id, // Add this line to store the product ID
      name: product.name || '',
      description: product.description || '',
      category: product.category?._id || '',
      allowCustomSize: Boolean(product.allowCustomSize),
      defaultSizes: Array.isArray(product.defaultSizes) ? product.defaultSizes : [],
    };

    setEditingProduct(product);
    setProduct(productData);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Add all product fields to formData
    Object.keys(product).forEach(key => {
      if (key === 'defaultSizes') {
        formData.append(key, JSON.stringify(product[key]));
      } else {
        formData.append(key, product[key]);
      }
    });

    // Add images if any
    if (images.length > 0) {
      images.forEach(img => formData.append('images', img));
    }

    try {
      if (isEditing && editingProduct?._id) {
        await axios.put(`http://localhost:5000/api/admin/products/${editingProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('http://localhost:5000/api/admin/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      await fetchProducts();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const resetForm = () => {
    setProduct({ name: '', description: '', category: '', allowCustomSize: false, defaultSizes: [] });
    setImages([]);
    setIsEditing(false);
    setEditingProduct(null);
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Product Management</h2>
            <Button onClick={() => setShowModal(true)}>Add New Product</Button>
          </div>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod._id}>
                  <td>
                    <img 
                      src={prod.images[0]?.url || 'http://localhost:5000/placeholder.jpg'} 
                      alt={prod.name} 
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>{prod.name}</td>
                  <td>{prod.category?.name}</td>
                  <td>
                    <Button variant="info" size="sm" className="me-2" onClick={() => handleEdit(prod)}>
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(prod._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Modal show={showModal} onHide={() => {resetForm(); setShowModal(false)}} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{isEditing ? 'Edit Product' : 'Add New Product'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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

                <Button type="submit" variant="primary" className="w-100">
                  {isEditing ? 'Update Product' : 'Save Product'}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </div>
  );
};

export default Product_Manage;
