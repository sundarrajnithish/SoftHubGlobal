import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import to get params from the URL and navigate
import './Products.css'; 
import Filter from '../components/Filter';
import '../components/Filter.css';

import LoadingSpinner from '../components/LoadingSpinner'; // Import the spinner component

const Products = () => {
  const { categorySlug } = useParams(); // Get categorySlug from URL parameters
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // For navigation purposes
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState(0);
  const [products, setProducts] = useState([]); // Store fetched products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [filteredResults, setFilteredResults] = useState([]);

  // Fetch products based on category from the API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://uffrpakypa.execute-api.ca-central-1.amazonaws.com/default/get-software-listings?category=${categorySlug}`
        );
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug]); // Refetch data whenever categorySlug changes

  // Filter products by categorySlug, search term, price, and rating
  const filteredProducts = products.filter(product => {
    let isInPriceRange = true;
    let meetsMinRating = true;
    let matchesSearch = true;

    const priceValue = typeof product.price === 'number' ? product.price : parseFloat(product.price?.toString()?.replace('$', ''));

    // Apply price filter only if minPrice or maxPrice is set
    if ((minPrice !== '' || maxPrice !== '') && product.price) {
      isInPriceRange = (minPrice === '' || parseFloat(minPrice.replace('$', '')) <= priceValue) &&
                       (maxPrice === '' || priceValue <= parseFloat(maxPrice.replace('$', '')));
    }

    // Apply rating filter only if rating is greater than 0
    if (rating > 0) {
      meetsMinRating = product.averagerating >= rating;
    }

    // Apply search filter only if searchTerm is not empty
    if (searchTerm.trim()) {
      matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    }

    return isInPriceRange && meetsMinRating && matchesSearch;
  });

  // Add these new functions
  const handleCategoryChange = (value) => {
    // Handle category change logic here if needed
    console.log('Selected Category:', value);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleProductClick = (productId) => {
    // Navigate to a dynamic product details page
    navigate(`/products/${categorySlug}/${productId}`);
  };

  const handleSearch = async () => {
    console.log("handleSearch function called");
    try {
      const payload = {
        queryStringParameters: {
          searchTerm: searchTerm,
          category: categorySlug
        }
      };
  
      const response = await fetch('https://r9hor2144d.execute-api.ca-central-1.amazonaws.com/dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        redirect: "follow"
      });
  
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${await response.text()}`);
      }
  
      const data = await response.json();
      setFilteredResults(data.body);
    } catch (error) {
      console.error('Error fetching search results:', error.message || error);
    }
  };
  useEffect(() => {
    if (filteredResults.length > 0) {
      setProducts(filteredResults);
    }
  }, [filteredResults]);

  return (
    <div className="products-container">
      <h1>{categorySlug.replace('-', ' ').toLocaleUpperCase()}</h1>

      {/* Display loading, error, or products */}
      {loading ? (
        <LoadingSpinner /> // Show spinner during loading
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          
          <div className='filter-container'>
            <Filter 
              minPrice={minPrice} 
              maxPrice={maxPrice} 
              rating={rating} 
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              setRating={handleRatingChange} 
            />
          </div>

          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div key={product['product-id']} className="product-card" onClick={() => handleProductClick(product['product-id'])}>
                  <img src={product.imgUrl} alt={product.name} className="product-image" />
                  <h2 className="product-name">{product.name}</h2>
                  <p className="product-price">${product.price}</p>
                  <p className="product-rating">⭐ {product.averagerating} ({product.totalreviews} reviews)</p>
                  <p className="product-description">{product.description}</p>
                </div>
              ))
            ) : (
              <p>No products found for this category.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
