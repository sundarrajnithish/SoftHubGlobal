import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Ensure styles are applied

const Home = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: 'Streaming Services',
      description: 'Software for movies, music, and games',
      imgUrl: 'https://softhubmetadata.s3.ca-central-1.amazonaws.com/Entertainment.png',
      slug: 'streaming-services', // Add a slug for cleaner URLs
    },
    {
      title: 'Games',
      description: 'Software for movies, music, and games',
      imgUrl: 'https://softhubmetadata.s3.ca-central-1.amazonaws.com/Games.png',
      slug: 'games',
    },
    {
      title: 'Microsoft',
      description: 'All things Microsoft software',
      imgUrl: 'https://softhubmetadata.s3.ca-central-1.amazonaws.com/Microsoft.png',
      slug: 'microsoft',
    },
    {
      title: 'Video Editors',
      description: 'Top software for editing videos',
      imgUrl: 'https://softhubmetadata.s3.ca-central-1.amazonaws.com/VEditors.png',
      slug: 'video-editors',
    },
  ];

  const handleCategoryClick = (category) => {
    // Navigate to the dynamic route
    navigate(`/products/${category.slug}`);
  };

  return (
    <div className="home-container">
      <h1>EXPLORE SOFTWARE CATEGORIES</h1>
      <div className="category-grid">
        {categories.map((category, index) => (
          <div
            key={index}
            className="category-tile"
            onClick={() => handleCategoryClick(category)}  // Navigate to dynamic URL
          >
            <img src={category.imgUrl} alt={category.title} className="category-img" />
            <div className="category-content">
              <h2 className="category-title">{category.title}</h2>
              <p className="category-description">{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
