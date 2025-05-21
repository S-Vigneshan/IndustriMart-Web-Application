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
    perMeterPrice: 0,
  });
  const [sizeInput, setSizeInput] = useState({ size: '', price: '',stock: '' });
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [existingImages, setExistingImages] = useState([]);

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
        defaultSizes: [...prev.defaultSizes, {
          size: sizeInput.size,
          price: parseFloat(sizeInput.price),
          stock: parseInt(sizeInput.stock) || 0
        }]
      }));
      setSizeInput({ size: '', price: '', stock: '' }); // Reset all fields
    }
  };
  const handleEdit = (product) => {
    if (!product || !product._id) {
      console.error('Invalid product data');
      return;
    }

    const productData = {
      _id: product._id,
      name: product.name || '',
      description: product.description || '',
      category: product.category?._id || '',
      allowCustomSize: Boolean(product.allowCustomSize),
      defaultSizes: Array.isArray(product.defaultSizes) ? product.defaultSizes : [],
      perMeterPrice: product.perMeterPrice || 0  // Add this line
    };

    setEditingProduct(product);
    setProduct(productData);
    setExistingImages(product.images || []); // Set existing images
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
  
    // Add basic fields
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('category', product.category);
    formData.append('allowCustomSize', String(product.allowCustomSize));
    formData.append('perMeterPrice', String(product.allowCustomSize ? product.perMeterPrice : 0));
    formData.append('defaultSizes', JSON.stringify(product.defaultSizes));
    
    // Add existing images
    formData.append('existingImages', JSON.stringify(existingImages));
  
    // Add new images
    if (images.length > 0) {
      images.forEach(img => formData.append('images', img));
    }
  
    try {
      const url = isEditing && editingProduct?._id 
        ? `http://localhost:5000/api/admin/products/${editingProduct._id}`
        : 'http://localhost:5000/api/admin/products';
  
      const method = isEditing ? 'put' : 'post';
  
      const response = await axios({
        method,
        url,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      if (response.data) {
        await fetchProducts();
        resetForm();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + (error.response?.data?.message || error.message));
    }
  };

  const resetForm = () => {
    setProduct({ 
      name: '', 
      description: '', 
      category: '', 
      allowCustomSize: false, 
      defaultSizes: [],
      perMeterPrice: 0
    });
    setImages([]);
    setExistingImages([]); // Clear existing images
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
          placeholder="Enter product name"
          required
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
                {product.allowCustomSize && (
              <Form.Group className="mb-3">
                <Form.Label>Price per Meter (රු)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={product.perMeterPrice}
                  onChange={(e) => setProduct({ ...product, perMeterPrice: parseFloat(e.target.value) })}
                  placeholder="Enter price per meter"
                />
              </Form.Group>
            )}

<Row className="mb-3">
  <Col>
    <Form.Control 
      placeholder="Size" 
      value={sizeInput.size} 
      onChange={(e) => setSizeInput({ ...sizeInput, size: e.target.value })} 
    />
  </Col>
  <Col>
    <Form.Control 
      placeholder="Price" 
      type="number" 
      value={sizeInput.price} 
      onChange={(e) => setSizeInput({ ...sizeInput, price: e.target.value })} 
    />
  </Col>
  <Col>
    <Form.Control 
      placeholder="Stock" 
      type="number" 
      min="0"
      value={sizeInput.stock} 
      onChange={(e) => setSizeInput({ ...sizeInput, stock: parseInt(e.target.value) || 0 })} 
    />
  </Col>
  <Col>
    <Button onClick={handleAddSize}>Add Size</Button>
  </Col>
</Row>

{product.defaultSizes.map((s, i) => (
  <div 
    key={i} 
    className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded shadow-sm"
    style={{
      background: 'linear-gradient(to right, #f8f9fa, #ffffff)',
      transition: 'all 0.2s ease-in-out'
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.01)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
  >
    <div className="d-flex gap-4">
      <span className="badge bg-primary px-3 py-2" style={{ fontSize: '0.9rem' }}>
        Size: {s.size}
      </span>
      <span className="badge bg-success px-3 py-2" style={{ fontSize: '0.9rem' }}>
        Price: රු{s.price}
      </span>
      <span className="badge bg-info px-3 py-2" style={{ fontSize: '0.9rem' }}>
        Stock: {s.stock}
      </span>
    </div>
    <Button 
      variant="danger" 
      size="sm"
      className="px-3"
      onClick={() => {
        setProduct({
          ...product,
          defaultSizes: product.defaultSizes.filter((_, index) => index !== i)
        });
      }}
    >
      Remove
    </Button>
  </div>
))}
<Form.Group className="mb-3">
  <Form.Label>Product Images</Form.Label>
  {existingImages.length > 0 && (
    <div className="mb-3">
      <p>Existing Images:</p>
      <div className="d-flex gap-2 mb-2">
        {existingImages.map((img, index) => (
          <div key={index} className="position-relative">
            <img
              src={img.url}
              alt={img.altText}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <Button
              variant="danger"
              size="sm"
              className="position-absolute top-0 end-0"
              onClick={() => {
                setExistingImages(existingImages.filter((_, i) => i !== index));
              }}
            >
              ×
            </Button>
          </div>
        ))}
      </div>
    </div>
  )}
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
