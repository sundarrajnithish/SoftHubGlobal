import React from 'react';
import './ApiDocumentation.css'; // Use this custom CSS file

const ApiDocumentation = () => {
  return (
    <div className="api-doc-container">
      <h1 className="api-doc-header">API Documentation</h1>
      <p className="api-doc-description">
        This page provides an overview of all available API endpoints. For detailed documentation, please refer to the link below.
      </p>

      {/* Link to Swagger Hub Documentation */}
      <div className="swagger-link-container">
        <a
          href="https://app.swaggerhub.com/apis/COEN6313/SoftHub/v1.1"
          target="_blank"
          rel="noopener noreferrer"
          className="swagger-link"
        >
          Click here for Swagger Hub API Documentation
        </a>
      </div>
    </div>
  );
};

export default ApiDocumentation;
