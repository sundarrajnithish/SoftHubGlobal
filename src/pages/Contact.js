import React from 'react';
import './Contact.css'; // Updated CSS file

const Contact = () => {
  return (
    <div className="contact-container">
      <section className="contact-header">
        <h1>Get in Touch</h1>
        <p>
          We're here to assist with any questions you may have about our software, activations, or subscriptions. Reach out using the form below or through the contact information provided. We look forward to hearing from you.
        </p>
      </section>

      <section className="contact-form">
        <form>
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
      </section>

      <section className="contact-info">
        <h2>Contact Information</h2>
        <p>Email: <a href="mailto:contact@yourwebsite.com">contact@yourwebsite.com</a></p>
        <p>Phone: +1-123-456-7890</p>
        <p>Address: 123 Your Street, City, Country</p>
      </section>
    </div>
  );
};

export default Contact;
