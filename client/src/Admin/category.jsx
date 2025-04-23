import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from './Sidebar';

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
      <div className="flex-grow-1">
        <Container fluid className="py-4">
          <Row className="mb-4">
            <Col md={6} className="mx-auto">
              <h2 className="text-center mb-4">Category Management</h2>
              <Form onSubmit={handleSubmit} className="bg-light p-4 rounded-3">
                <Form.Group className="mb-3">
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100">
                  Add Category
                </Button>
              </Form>
            </Col>
          </Row>
          
          <Row>
            <Col>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
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
                          />
                        ) : category.description}
                      </td>
                      <td>
                        <Button
                          variant={editingId === category._id ? "success" : "primary"}
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(category)}
                        >
                          {editingId === category._id ? "Save" : "Edit"}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(category._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Category;
