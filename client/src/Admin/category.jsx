import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FaTags, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/categories', newCategory);
      await fetchCategories();
      setNewCategory({ name: '', description: '' });
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/categories/${id}`);
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEdit = async (category) => {
    if (editingId === category._id) {
      try {
        await axios.put(`http://localhost:5000/api/admin/categories/${category._id}`, category);
        await fetchCategories();
        setEditingId(null);
      } catch (error) {
        console.error('Error updating category:', error);
      }
    } else {
      setEditingId(category._id);
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
                  <FaTags className="text-primary" />
                  Category Management
                </h2>
                <p className="text-muted mb-0">Manage your product categories</p>
              </div>
            </div>
          </div>

          <Row className="g-4">
            {/* Add Category Form */}
            <Col lg={4}>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <h4 className="mb-4">Add New Category</h4>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      required
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Group>
                  <Button 
                    type="submit" 
                    style={{
                      backgroundColor: '#1a237e',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      width: '100%'
                    }}
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaPlus /> Add Category
                  </Button>
                </Form>
              </div>
            </Col>

            {/* Categories Table */}
            <Col lg={8}>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div className="table-responsive">
                  <Table hover style={{ marginBottom: 0 }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th>Name</th>
                        <th>Description</th>
                        <th style={{ width: '200px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(category => (
                        <tr key={category._id}>
                          <td>
                            {editingId === category._id ? (
                              <Form.Control
                                type="text"
                                value={category.name}
                                onChange={(e) => setCategories(categories.map(cat =>
                                  cat._id === category._id ? {...cat, name: e.target.value} : cat
                                ))}
                                style={{ borderRadius: '8px' }}
                              />
                            ) : category.name}
                          </td>
                          <td>
                            {editingId === category._id ? (
                              <Form.Control
                                type="text"
                                value={category.description}
                                onChange={(e) => setCategories(categories.map(cat =>
                                  cat._id === category._id ? {...cat, description: e.target.value} : cat
                                ))}
                                style={{ borderRadius: '8px' }}
                              />
                            ) : category.description}
                          </td>
                          <td>
  <div className="d-flex gap-2">
    <Button
      variant={editingId === category._id ? "success" : "outline-primary"}
      size="sm"
      className="d-inline-flex align-items-center gap-1"
      style={{
        borderRadius: '8px',
        minWidth: '80px',
        padding: '0.4rem 0.8rem',
        transition: 'all 0.2s ease'
      }}
      onClick={() => handleEdit(category)}
    >
      {editingId === category._id ? (
        <>
          <FaEdit size={14} /> Save
        </>
      ) : (
        <>
          <FaEdit size={14} /> Edit
        </>
      )}
    </Button>
    <Button
      variant="outline-danger"
      size="sm"
      className="d-inline-flex align-items-center gap-1"
      style={{
        borderRadius: '8px',
        minWidth: '80px',
        padding: '0.4rem 0.8rem',
        transition: 'all 0.2s ease'
      }}
      onClick={() => {
        if (window.confirm('Are you sure you want to delete this category?')) {
          handleDelete(category._id);
        }
      }}
    >
      <FaTrash size={14} /> Delete
    </Button>
  </div>
</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Category;