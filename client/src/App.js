import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login/login';
import Signup from './signup/signup';
import HomePage from './home/HomePage';
import Navbar from './navbar/navbar'; // Ensure your import paths are correct
import CartPage from './CartPage/CartPage'; // Import CartPage
import { CartProvider } from './context/CartContext';
import ShopPage from './Shop/shop';
import AboutUsPage from './about/about';
import ContactPage from './contact/contact';
import ProductDetails from './ProductModal/ProductDetails';
import Footer from './footer/footer'; // Import Footer component
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './my profile/profile'; // Add this import
import ForgotPassword from './forgotPass/forgotPass'; // Add this import


function App() {
  return (
    <CartProvider>
      <Router>
        {/* Navbar will be displayed on every page */}
        <Navbar />
        
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/" element={<HomePage />} />
            
            {/* Protected Routes */}
            <Route path="/cart" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
            <Route path="/shop" element={
              <ProtectedRoute>
                <ShopPage />
              </ProtectedRoute>
            } />
            <Route path="/product/:id" element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Public Routes */}
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
          </Routes>
        
        {/* Footer will be displayed on every page */}
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
