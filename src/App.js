// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import AnalyticsPage from './pages/AnalyticsPage';
import MyProducts from './pages/MyProducts';
import ProductForm from './pages/ProductForm';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import SignUp from './pages/SignUp';
import { AuthProvider } from './components/AuthContext';
import ConfirmEmail from './pages/ConfirmEmail';

import ContactAndAbout from './pages/ContactAndAbout';
import ApiDocumentation from './pages/ApiDocumentation';

import Stripe from './pages/Stripe';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Checkout from './pages/Checkout';

import OrdersPage from './pages/OrdersPage';

const stripePromise = loadStripe('pk_test_51QK8A7IKDma6OOXz5P6x8Y82Ph13QXoIeJnPfNkZCy3eNB6qMUhfArnpFwG3CsDEWtw9wQbKHzF4nhwNFjaHUWuD00L6dLJNuO');




function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<ContactAndAbout />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/cart" element={<Elements stripe={stripePromise}><Cart /></Elements>} />
          
          <Route path="/api" element={<ApiDocumentation />} />
          <Route path="/products/:categorySlug" element={<Products />} />
          <Route path="/products/:categorySlug/:productId" element={<ProductDetails />} />
          <Route path="/dashboard" element={<AnalyticsPage />} />
          <Route path="/myproducts" element={<MyProducts />} />
          <Route path="/provider/add-software" element={<ProductForm isEditMode={false} />} />
          <Route path="/provider/edit-software/:productId" element={<ProductForm isEditMode={true} />} />
          <Route path="/admindashboard" element={<AdminAnalyticsPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/stripe" element={<Stripe />} />
          <Route path="/checkout" element={<Elements stripe={stripePromise}><Checkout /></Elements>} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
