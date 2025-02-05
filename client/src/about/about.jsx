import React from 'react';
import './about.css';

const AboutUsPage = () => {
  return (
    <div className="about-us-container">
      {/* Hero Section */}
      <div className="about-hero">
        <h1>About Us</h1>
        <p>Learn more about our mission, vision, and values at IndustriMart.</p>
      </div>

      {/* Content Sections */}
      <div className="about-content">
        <section className="card mission">
          <h2>Our Mission</h2>
          <p>
            At IndustriMart, our mission is to provide top-quality industrial materials to businesses and individuals. We are dedicated to offering innovative solutions that meet the evolving needs of our customers.
          </p>
        </section>

        <section className="card vision">
          <h2>Our Vision</h2>
          <p>
            We aim to be a globally recognized e-commerce platform for industrial supplies, known for quality and customer satisfaction. We envision a future where our customers can easily access the best products with just a few clicks.
          </p>
        </section>

        <section className="card team">
          <h2>Meet Our Team</h2>
          <p>
            Our professional and dedicated team works tirelessly to bring you the best materials and ensure that you have an exceptional shopping experience with IndustriMart.
          </p>
        </section>

        <section className="card values">
          <h2>Our Core Values</h2>
          <ul>
            <li><strong>Integrity:</strong> Honest and transparent business practices.</li>
            <li><strong>Quality:</strong> Delivering superior products every time.</li>
            <li><strong>Customer Focus:</strong> Ensuring our customers are at the center of everything we do.</li>
            <li><strong>Innovation:</strong> Continuously improving to better serve you.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
