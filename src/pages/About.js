import React from 'react';
import './About.css'; // Updated CSS file

const About = () => {
  return (
    <div className="about-container">
      <section className="about-header">
        <h1>About Us</h1>
        <p>
          At [Your Company Name], we are dedicated to providing seamless software solutions, activations, and subscriptions all in one place. Our mission is to empower individuals and businesses to access the best software tools with unparalleled convenience.
        </p>
      </section>

      <section className="about-section">
        <div className="about-content">
          <h2>Our Vision</h2>
          <p>
            We envision a world where accessing software is effortless, transparent, and adaptable to the needs of every customer. Our focus on innovation ensures we are always evolving to provide best-in-class solutions.
          </p>
        </div>
        <div className="about-content">
          <h2>Our Values</h2>
          <ul>
            <li><strong>Customer-Centric:</strong> We prioritize customer satisfaction above all.</li>
            <li><strong>Innovation:</strong> We constantly seek ways to improve and adapt.</li>
            <li><strong>Integrity:</strong> We believe in ethical practices and transparency.</li>
          </ul>
        </div>
      </section>

      <section className="about-team">
        <h2>Meet Our Team</h2>
        <p>
          Our team comprises industry experts, dedicated to creating a user-friendly experience and providing exceptional support every step of the way.
        </p>
        {/* Optional - Insert team cards here if applicable */}
      </section>
    </div>
  );
};

export default About;
