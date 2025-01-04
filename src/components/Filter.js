import React, { useState } from 'react';
import './Filter.css';

function Filter({ minPrice, maxPrice, rating, setMinPrice, setMaxPrice, setRating }) {


  const handlePriceChange = (type, value) => {
    if (type === 'min') setMinPrice(value);
    if (type === 'max') setMaxPrice(value);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  return (
        <div className="price-and-ratings-filter">
        <div className="price-filter">
            <label>Price:</label>
            <input
            type="number"
            value={minPrice}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            placeholder="Min"
            />
            <input
            type="number"
            value={maxPrice}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            placeholder="Max"
            />
        </div>
        <div className="ratings-filter">
            <label>Ratings:</label>
            <div className="star-ratings">
            {[1, 2, 3, 4, 5].map((star, index) => (
                <span
                key={index}
                className={`star-rating ${rating >= star ? 'active' : ''}`}
                onClick={() => handleRatingChange(star)}
                >
                &#9733;
                </span>
            ))}
            </div>
        </div>
    </div>
    
  );
}

export default Filter;