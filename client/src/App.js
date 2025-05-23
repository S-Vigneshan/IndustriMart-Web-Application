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
import UpdatePassword from './updatepassword/updatePass'; // Add this import  
import AdminRoute from './components/AdminRoute';
import AdminSignIn from './Admin/AdminSignIn';
import Dashboard from './Admin/DashBoard';
import UserManagement from './Admin/user';
import ProductManagement from './Admin/Product_Manage';  // Changed to PascalCase
import Category from './Admin/category'; // Add this import
import Checkout from './Checkout/checkout'; // Add this import
import OrderConfirmation from './Orderconfirmpage/confirmation'; // Add this import
import MyOrder from './Myorders/myOrder';
import OrderManagement from './Admin/order_Management';
import Feedbacks from './Admin/feedBacks'; 
function App() {
  return (
    <CartProvider>
      <Router>
        {/* Conditional Navbar rendering - Don't show on admin routes */}
        {!window.location.pathname.includes('/admin') && <Navbar />}
        
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
            <Route path="/checkout" element={
                  <ProtectedRoute>
                   <Checkout />
                  </ProtectedRoute>
            } />
            <Route path="/order-confirmation/:orderId" element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          } />
          <Route path="/my-orders" element={
            <ProtectedRoute>
             <MyOrder />
            </ProtectedRoute>
          } />
            
            {/* Public Routes */}
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />

            {/* Admin Routes */}
            <Route path="/admin/signin" element={<AdminSignIn />} />
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            } />
            <Route path="/admin/products" element={
              <AdminRoute>
                <ProductManagement />  {/* Changed to PascalCase */}
              </AdminRoute>
            } />
            <Route path="/admin/categories" element={
              <AdminRoute>
                <Category />  {/* Changed to PascalCase */}
              </AdminRoute>
            } />
            <Route path="/admin/orders" element={
              <AdminRoute>
                <OrderManagement />
              </AdminRoute>
            } />
            <Route path="/admin/settings" element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } />
            <Route path="/admin/feedbacks" element={
            <AdminRoute>
              <Feedbacks />
            </AdminRoute>
          } />
            
          </Routes>
        
        {/* Conditional Footer rendering - Don't show on admin routes */}
        {!window.location.pathname.includes('/admin') && <Footer />}
      </Router>
    </CartProvider>
  );
}

export default App;
