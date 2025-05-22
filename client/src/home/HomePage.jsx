import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/products');
        // Get only first 3 products
        setProducts(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* Jumbotron / Home Page Content */}
      <div className="jumbotron">
        <h1 className="display-4">Welcome to IndustriMart E-commerce!</h1>
        <p className="lead">Your one-stop solution for industrial materials like plastic bottles, aluminium sheets, and more.</p>
        <hr className="my-4" />
        <p>Explore our wide range of products today.</p>
        <Link to="/Shop" className="btn btn-primary btn-lg">Browse Products</Link>
      </div>

      {/* Featured Products Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Featured Products</h2>
        <div className="row g-4">
          {products.map(product => (
            <div key={product._id} className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="position-relative">
                  <img 
                    src={product.images[0]?.url || 'placeholder-image.jpg'} 
                    className="card-img-top" 
                    alt={product.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted">{product.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      {product.defaultSizes && product.defaultSizes.length > 0 ? (
                        <p className="mb-0 fw-bold">
                          From රු {Math.min(...product.defaultSizes.map(size => size.price)).toLocaleString()}
                        </p>
                      ) : (
                        <p className="mb-0 fw-bold">
                          රු {product.perMeterPrice?.toLocaleString()} per meter
                        </p>
                      )}
                    </div>
                    <Link 
                      to={`/shop/product/${product._id}`} 
                      className="btn btn-outline-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to="/Shop" className="btn btn-lg btn-outline-primary">
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;