import React from 'react';
import './HomePage.css';




const HomePage = () => {
  return (
    <div>
      {/* Jumbotron / Home Page Content */}
      <div className="jumbotron">
        <h1 className="display-4">Welcome to IndustriMart E-commerce!</h1>
        <p className="lead">Your one-stop solution for industrial materials like plastic bottles, aluminium sheets, and more.</p>
        <hr className="my-4" />
        <p>Explore our wide range of products today.</p>
        <a className="btn btn-primary btn-lg" href="/Shop" role="button">Browse Products</a>
      </div>

      {/* Product Cards */}
      <div className="product-cards">
        <div className="card">
          <div className="sale-icon">Sale</div>
          <img src='../images/download.jpeg' className="card-img-top" alt="Product 1" />
          <div className="card-body">
            <h5 className="card-title">Plastic Bottles</h5>
            <p className="card-text">$15.99 <span className="old-price">$20.00</span></p>
            <a href="/shop/product/1" className="btn btn-outline-primary">View Product</a>
          </div>
        </div>

        <div className="card">
          <div className="sale-icon">Sale</div>
          <img src="../images/product2.jpg" className="card-img-top" alt="Product 2" />
          <div className="card-body">
            <h5 className="card-title">Aluminium Sheets</h5>
            <p className="card-text">$45.99 <span className="old-price">$60.00</span></p>
            <a href="/shop/product/2" className="btn btn-outline-primary">View Product</a>
          </div>
        </div>

        <div className="card">
          <div className="sale-icon">Sale</div>
          <img src="../images/product3.jpg" className="card-img-top" alt="Product 3" />
          <div className="card-body">
            <h5 className="card-title">Copper Rods</h5>
            <p className="card-text">$39.99 <span className="old-price">$50.00</span></p>
            <a href="/shop/product/3" className="btn btn-outline-primary">View Product</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
