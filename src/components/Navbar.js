import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import AuthContext from './AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, userRole } = useContext(AuthContext);

  // Toggle the menu open/close
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu on link click
  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const renderMenuItems = () => {
    switch (userRole) {
      case 'Consumer':
        return (
          <>
            <li><Link to="/" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/cart" onClick={closeMenu}>Cart</Link></li>
            <li><Link to="/orders" onClick={closeMenu}>Orders</Link></li>
            <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
          </>
        );
      case 'Provider':
        return (
          <>
            <li><Link to="/myproducts" onClick={closeMenu}>My Products</Link></li>
            <li><Link to="/dashboard" onClick={closeMenu}>Analytics</Link></li>
          </>
        );
      case 'Admin':
        return (
          <>
            <li><Link to="/" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/admindashboard" onClick={closeMenu}>Dashboard</Link></li>
            <li><Link to="/quicksight" onClick={closeMenu}>QuickSight</Link></li>
            <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
          </>
        );
      default:
        return (
          <>
            <li><Link to="/" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/api" onClick={closeMenu}>API</Link></li>
            <li><Link to="/contact" onClick={closeMenu}>About</Link></li>
          </>
        );
    }
  };

  return (
    <>
      <nav className={`navbar ${isOpen ? 'blurred' : ''}`}>
      <div className="logo-container">
      <img src= {'https://softhubmetadata.s3.ca-central-1.amazonaws.com/Logo.PNG'} alt="SoftHub Logo" className="logo-image" />
      <h2 className="logo">SoftHub</h2>
      </div>

        {/* Hamburger menu for small screens */}
        <div className={`hamburger ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span className="bar bar1"></span>
          <span className="bar bar2"></span>
          <span className="bar bar3"></span>
        </div>

        {/* Nav links */}
        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          {renderMenuItems()}

          {!isAuthenticated && (
            <>
              <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
              <li><Link to="/signup" onClick={closeMenu}>Signup</Link></li>
            </>
          )}

          {isAuthenticated && (
            <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
          )}
        </ul>
      </nav>

      {/* Background overlay */}
      {isOpen && <div className="overlay" onClick={closeMenu}></div>}
    </>
  );
};

export default Navbar;
