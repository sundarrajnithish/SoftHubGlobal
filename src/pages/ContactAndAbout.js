import React from 'react';
import './ContactAndAbout.css'; // Use this combined CSS file

const ContactAndAbout = () => {
  return (
    <div className="contact-and-about-container">
      {/* About Us Section */}
      <section className="about-section">
        <div className="about-header">
          <h1>About Us</h1>
          <p>
            At [Your Company Name], we provide seamless solutions for software, activations, and subscriptions. Our goal is to simplify and enhance the way people interact with essential digital tools.
          </p>
        </div>
        <div className="about-content">
          <h2>Our Mission</h2>
          <p>
            We strive to offer innovative and user-friendly services, allowing individuals and businesses to access top-notch software solutions effortlessly.
          </p>
        </div>
        <div className="about-content">
          <h2>Our Commitment</h2>
          <ul>
            <li><strong>Quality Assurance:</strong> We deliver nothing but the best in every product and service we offer.</li>
            <li><strong>Customer First:</strong> Your satisfaction is our top priority.</li>
            <li><strong>Transparency:</strong> We believe in honest communication and fair practices.</li>
          </ul>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-section">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>
            Have any questions or need assistance? Feel free to reach out using the form below, or contact us directly through our provided details.
          </p>
        </div>
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Your Name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Your Email" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" placeholder="Your Message" rows="5" required></textarea>
          </div>
          <button type="submit" className="contact-btn">Send Message</button>
        </form>
        <div className="contact-info">
          <h2>Contact Information</h2>
          <p>Email: <a href="mailto:contact@yourwebsite.com">contact@yourwebsite.com</a></p>
          <p>Phone: +1-123-456-7890</p>
          <p>Address: 123 Your Street, City, Country</p>
        </div>
      </section>
    </div>
  );
};

export default ContactAndAbout;
