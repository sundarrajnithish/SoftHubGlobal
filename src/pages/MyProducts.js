import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './MyProduct.css';
import Filter from '../components/Filter';
import '../components/Filter.css';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../components/AuthContext';


const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [rating, setRating] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const { categorySlug } = useParams(); // Get categorySlug from URL parameters
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const navigate = useNavigate();
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [successPopupVisible, setSuccessPopupVisible] = useState(false);
    const {userDetails} = useAuth();

    useEffect(() => {
        fetchProducts();
    }, [userDetails]);


    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const provider_id = userDetails && userDetails['sub']
            console.log("Provider ID:", provider_id);
            if(!provider_id) {
                console.error("Provider ID is not available.");
                return;
            }

            const response = await fetch(
                `https://dseobqi29d.execute-api.ca-central-1.amazonaws.com/dev/products?provider_id=${provider_id}`
            );
            const data = await response.json();
            setProducts(data.body.products);
        } catch (err) {
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products && products.filter(product => {
        let isInPriceRange = true;
        let meetsMinRating = true;

        if ((minPrice !== '' || maxPrice !== '') && product.price) {
            const priceValue = parseFloat(product.price.replace('$', ''));
            isInPriceRange = (minPrice === '' || parseFloat(minPrice.replace('$', '')) <= priceValue) &&
                (maxPrice === '' || priceValue <= parseFloat(maxPrice.replace('$', '')));
        }

        if (rating > 0) {
            meetsMinRating = product.rating >= rating;
        }

        return isInPriceRange && meetsMinRating;
    });

    const handleEdit = (productId) => {
        console.log(`Editing product: ${productId}`);
        navigate(`/provider/edit-software/${productId}`);
        // Implement edit functionality here
    };

    const handleDelete = (productId) => {
        setDeleteProductId(productId);
        setShowDeleteConfirmation(true);
    };



    const confirmDelete = async () => {
        setShowDeleteConfirmation(false);
        setLoading(true);

        try {
            const payload = {
                queryStringParameters: {
                    productId: deleteProductId
                }
            };

            const response = await fetch('https://a7g6yfjs7k.execute-api.ca-central-1.amazonaws.com/dev/productId', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                redirect: "follow"
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${await response.text()}`);
            }
            if (response.ok) {
                setSuccessPopupVisible(true);
            }
            const data = await response.json();
            console.log("Product deleted successfully:", data);

            // Refresh the products list after deletion
            fetchProducts();

        } catch (error) {
            console.error('Error deleting product:', error.message || error);
            alert('Failed to delete product. Please try again.');
        } finally {
            setLoading(false);
        }

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

    const closeMenu = () => {
        // Close menu logic here
        // For example, you might want to update a state variable
        setShowForm(false);
    };

    return (
        <div className="my-products-container">
            {/* Search bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {/* Filter */}
            <Filter
                minPrice={minPrice}
                maxPrice={maxPrice}
                rating={rating}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                setRating={(newRating) => setRating(newRating)}
            />

            {/* Product grid */}
            <div className="product-grid">
                <div className="add-product-button" >
                    <button onClick={() =>
                        navigate("/provider/add-software")
                    }>+</button>
                </div>
                {filteredProducts && filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div key={product['product-id']} className="product-card">
                            <img src={product.imgUrl} alt={product.name} className="product-image" />
                            <div className="product-details-info">
                                <div className="product-actions">
                                    <button onClick={() => handleEdit(product['product-id'])}>Edit</button>
                                    <button onClick={() => handleDelete(product['product-id'])}>Delete</button>
                                </div>
                                <h2 className="product-name">{product.name}</h2>
                                <p className="product-price">{product.price}</p>
                                <p className="product-rating">⭐ {product.rating} ({product.reviews} reviews)</p>
                                <p className="product-description">{product.description}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No products found</div>
                )}
            </div>
            {showDeleteConfirmation && (
                <div className="confirmation-modal">
                    <p>Are you sure you want to delete this product?</p>
                    <button className="confirm-button" onClick={confirmDelete}>
                        Yes
                    </button>
                    <button className="cancel-button" onClick={() => setShowDeleteConfirmation(false)}>
                        No
                    </button>
                </div>
            )}
            {successPopupVisible && (
                <div className="success-popup">
                    <p>Product has been deleted successfully.</p>
                    <button className="ok-button" onClick={() => setSuccessPopupVisible(false)}>
                        OK
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyProducts;