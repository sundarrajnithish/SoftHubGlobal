import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import "./ProductDetails.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import AuthContext from '../components/AuthContext';


const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: "0",
};

const ProductDetails = () => {
  const { categorySlug, productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [stars, setStars] = useState(0);
  const [sentiment, setSentiment] = useState(null);

  const [reviewSummary, setReviewSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  const { isAuthenticated, userDetails } = useContext(AuthContext);
  const userSub = userDetails?.sub;

  const [recommendations, setRecommendations] = useState([]); // Add this state for recommendations
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoadingRecommendations(true);
      try {
        const response = await axios.get(
          "https://uffrpakypa.execute-api.ca-central-1.amazonaws.com/default/get-software-listings",
          {
            params: { category: categorySlug },
          }
        );
        // Filter out the current product by comparing the product IDs
        const filteredRecommendations = response.data.filter(
          (recProduct) => recProduct["product-id"] !== productId
        );
        setRecommendations(filteredRecommendations); // Set the filtered recommendations
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoadingRecommendations(false);
      }
    };
    fetchRecommendations();
  }, [categorySlug, productId]); // Include productId as a dependency  

  // Fetch product details
  useEffect(() => {
    setLoading(true);
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `https://46x4o900l3.execute-api.ca-central-1.amazonaws.com/productDetails/products`,
          {
            params: { productId },
          }
        );
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [productId]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://jeyfj1w15j.execute-api.ca-central-1.amazonaws.com/reviews/reviews`,
          {
            params: { productId },
          }
        );
        setReviews(
          Array.isArray(response.data.reviews) ? response.data.reviews : []
        );
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      }
    };
    fetchReviews();
  }, [productId]);

  // Sentiment analysis
  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const response = await axios.get(
          `https://1uwq38cfmi.execute-api.ca-central-1.amazonaws.com/llamaReviewSummary/getSummary`,
          {
            params: { productId, "type":"2" },
          }
        );
        const data = response.data;
        setSentiment(data.summary);
      } catch (error) {
        console.error("Error fetching sentiment analysis:", error);
      }
    };
    fetchSentiment();
  }, [productId]);

  // Review summary
  useEffect(() => {
    const fetchReviewSummary = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `https://1uwq38cfmi.execute-api.ca-central-1.amazonaws.com/llamaReviewSummary/getSummary`,
          {
            params: { productId, "type":"1" },
          }
        );
        const data = response.data;
        setReviewSummary(data.summary);
      } catch (err) {
        setError("Unable to fetch review summary.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviewSummary();
  }, [productId]);

  const handlePostReview = async () => {
    if (!newReview || stars === 0) return;

    const reviewData = {
      productId,
      content: newReview,
      rating: stars,
    };

    try {
      const response = await axios.post(
        `https://jeyfj1w15j.execute-api.ca-central-1.amazonaws.com/reviews/reviews`,
        reviewData
      );
      setReviews([
        ...reviews,
        { ...reviewData, postedAt: new Date().toISOString() },
      ]);
      setNewReview("");
      setStars(0);
    } catch (error) {
      console.error("Error posting review:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  const handleRecommendationClick = (recProductCategory, recProductId) => {
    navigate(`/products/${recProductCategory}/${recProductId}`);
  };

  const handleBuyClick = (product) => {
    navigate("/checkout", {
      state: {
        productDetails: {
          id: productId,
          name: product.Name,
          price: product.Price,
          image: product["title-image"],
          description: product.Description,
          developer: product.Developer,
          platform: product.Platform,
        },
      },
    });
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("You must be logged in to add items to your cart.");
      return;
    }

    setIsAddingToCart(true);
  
    const cartData = {
      userName: userSub, // from AuthContext
      productId, // from useParams
    };

    console.log("Sending to cart API:", cartData);
  
    try {
      const response = await axios.post(
        "https://p3aqkfift3.execute-api.ca-central-1.amazonaws.com/Cart/Cart", // Replace with your actual API Gateway URL
        cartData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 2000);

      console.log(response.data.message); // Display success message
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to the cart. Please try again.");
    } finally {
      setIsAddingToCart(false); 
    }
  };
  

  return (
    <div className="product-page">
      {/* Header Section */}
      <header className="product-header">
        <div className="header-content">
          <img
            src={product["title-image"]}
            alt={product.Name}
            className="game-image"
          />
        </div>
        <div className="game-info">
          <h1 className="game-title">{product.Name}</h1>
          <p className="developer-info">
            {product.Developer} - {categorySlug}
          </p>
          <div className="tags">
            <span className="tag">Supported Platforms: {product.Platform}</span>
          </div>
          {sentiment && (
            <div className="rainbow">
              <p>What Everyone Thinks: </p>
              <p>{sentiment}</p>
            </div>
          )}

          <div className="buy-button-container">
            <button
              className={`buy-button ${!isAuthenticated ? 'disabled' : ''}`}
              onClick={() => handleBuyClick(product)}
              disabled={!isAuthenticated}
            >
              Buy ${product.Price}
            </button>

            <button
              className={`cart-button ${!isAuthenticated ? 'disabled' : ''} ${cartSuccess ? "success" : ""}`}
              onClick={handleAddToCart}
              disabled={!isAuthenticated}
            >
              {cartSuccess ? "Added!" : isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </header>

      {/* Gallery Section */}
      <section className="gallery-section">
        <h2>Gallery</h2>
        <Slider {...settings}>
          {product["gallery-images"].map((imgUrl, index) => (
            <div key={index} className="gallery">
              <img src={imgUrl} alt={`Gallery ${index + 1}`} />
            </div>
          ))}
        </Slider>
      </section>

      {/* Description Section */}
      <section className="description-section">
        <div className="description">
          <h3>Description</h3>
          <p>{product.Description}</p>
        </div>
        <div className="product-details">
          <p>
            <strong>Developer:</strong> {product.Developer}
          </p>
          <p>
            <strong>Release Date:</strong> {product.ReleaseDate}
          </p>
          <p>
            <strong>Size:</strong> {product.Size}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <div className="product-features">
        <h3>Features:</h3>
        <ul>
          {product.Features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h3>Reviews ({reviews.length})</h3>

        {/* Review Summary Section */}
        <div className="review-summary">
          <h3>Review Summary</h3>
          {isLoading ? (
            <div className="spinner"></div>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="rainbow-summary">
              <p>{reviewSummary}</p>
            </div>
          )}
        </div>

        <textarea
          placeholder="Write your review here..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
        />
        <div>
          <label>Rating:</label>
          <input
            type="number"
            min="1"
            max="5"
            value={stars}
            onChange={(e) => setStars(parseInt(e.target.value))}
          />
        </div>
        <button onClick={handlePostReview}>Post Review</button>

        <div className="review-list">
          {Array.isArray(reviews) &&
            reviews.map((review) => (
              <div key={review["review-id"]} className="review-item">
                <p>
                  <strong>Rating:</strong>{" "}
                  <span className="rating-stars">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </p>
                <p>{review.content}</p>
                <time>
                  Posted on: {new Date(review["posted-at"]).toLocaleString()}
                </time>
              </div>
            ))}
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="recommendations-section">
        <h3>You may also like:</h3>
        {loadingRecommendations ? (
          <p>Loading recommendations...</p>
        ) : (
          <div className="recommended-products">
            {recommendations.map((recProduct) => (
              <div
                key={recProduct["product-id"]}
                className="recommended-product"
                onClick={() =>
                  handleRecommendationClick(recProduct.category, recProduct["product-id"])
                }
              >
                <img
                  src={recProduct.imgUrl}
                  alt={recProduct.name}
                  className="recommended-image"
                />
                <h4>{recProduct.name}</h4>
                <p>${recProduct.price}</p>
                {recProduct.averagerating && (
                  <p>Rating: {recProduct.averagerating.toFixed(1)}★</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductDetails;
