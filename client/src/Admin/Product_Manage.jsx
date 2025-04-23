import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Badge } from 'react-bootstrap';
import Sidebar from './Sidebar';

const Product_Manage = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',  // Add this
    defaultSizes: [],
    allowCustomSize: false,
    images: []
  });
  const [categories, setCategories] = useState([]); // Add this state

  // Add useEffect to fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const [sizeInput, setSizeInput] = useState({ size: '', price: '' });

  const handleAddSize = () => {
    if (sizeInput.size && sizeInput.price) {
      setProduct({
        ...product,
        defaultSizes: [...product.defaultSizes, sizeInput]
      });
      setSizeInput({ size: '', price: '' });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      altText: file.name
    }));
    setProduct({
      ...product,
      images: [...product.images, ...newImages]
    });
  };

  const handleRemoveSize = (indexToRemove) => {
    setProduct({
      ...product,
      defaultSizes: product.defaultSizes.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setProduct({
      ...product,
      images: product.images.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement your API call here
      console.log('Submitting product:', product);
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Container fluid className="py-4">
          <Row>
            <Col md={12} lg={8} className="mx-auto">
              <h2 className="text-center mb-4">Add New Product</h2>
              <Form onSubmit={handleSubmit} className="bg-light p-4 rounded-3">
                <Form.Group className="mb-4">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    value={product.name}
                    onChange={(e) => setProduct({...product, name: e.target.value})}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={product.category}
                    onChange={(e) => setProduct({...product, category: e.target.value})}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Product description"
                    value={product.description}
                    onChange={(e) => setProduct({...product, description: e.target.value})}
                  />
                </Form.Group>

                <div className="bg-white p-4 rounded-3 mb-4">
                  <h5>Size Options</h5>
                  <Form.Check
                    type="switch"
                    id="custom-size-switch"
                    label="Allow Custom Size"
                    checked={product.allowCustomSize}
                    onChange={(e) => setProduct({...product, allowCustomSize: e.target.checked})}
                    className="mb-3"
                  />

                  <Row className="g-2 mb-3">
                    <Col sm={5}>
                      <Form.Control
                        type="text"
                        placeholder="Size"
                        value={sizeInput.size}
                        onChange={(e) => setSizeInput({...sizeInput, size: e.target.value})}
                      />
                    </Col>
                    <Col sm={5}>
                      <Form.Control
                        type="number"
                        placeholder="Price"
                        value={sizeInput.price}
                        onChange={(e) => setSizeInput({...sizeInput, price: e.target.value})}
                      />
                    </Col>
                    <Col sm={2}>
                      <Button variant="primary" onClick={handleAddSize} className="w-100">
                        Add
                      </Button>
                    </Col>
                  </Row>

                  <div className="d-flex flex-wrap gap-2">
                    {product.defaultSizes.map((size, index) => (
                      <Badge 
                        bg="secondary" 
                        className="p-2 d-flex align-items-center" 
                        key={index}
                      >
                        {size.size} - ${size.price}
                        <Button 
                          variant="link" 
                          className="p-0 ms-2 text-white" 
                          onClick={() => handleRemoveSize(index)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-3 mb-4">
                  <h5>Product Images</h5>
                  <Form.Group>
                    <Form.Control
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mb-3"
                    />
                  </Form.Group>
                  <Row className="g-2">
                    {product.images.map((image, index) => (
                      <Col xs={6} md={4} lg={3} key={index}>
                        <div className="position-relative">
                          <img 
                            src={image.url} 
                            alt={image.altText} 
                            className="img-thumbnail"
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1"
                            onClick={() => handleRemoveImage(index)}
                          >
                            ×
                          </Button>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>

                <div className="d-grid">
                  <Button variant="primary" size="lg" type="submit">
                    Save Product
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Product_Manage;
