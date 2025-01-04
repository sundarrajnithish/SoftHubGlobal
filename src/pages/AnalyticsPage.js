import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import AuthContext from '../components/AuthContext';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewSummary, setReviewSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { isAuthenticated, userDetails } = useContext(AuthContext);
  const providerId = userDetails?.sub;

  // Make an API call to fetch the data
  useEffect(() => {
    if (providerId) {
      axios
        .get(`https://bcre43v783.execute-api.ca-central-1.amazonaws.com/default/GET-Provider-Dashboard?provider-id=${providerId}`)
        .then(response => {
          setData(response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [providerId]); // The effect will run whenever providerId changes

  const fetchReviewSummary = async (productId) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(
          'https://1uwq38cfmi.execute-api.ca-central-1.amazonaws.com/llamaReviewSummary/getSummary',
        {
          params: { productId, type: "3" },
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

  useEffect(() => {
    if (selectedProduct) {
      fetchReviewSummary(selectedProduct["product-id"]?.S);
    }
  }, [selectedProduct]);

  if (!data) {
    return <div>Loading...</div>;
  }

  // Directly use the total orders and total sales from the performance data
  const totalOrders = data.performance?.total_orders || 0;
  const totalSales = data.performance?.total_sales || 0;

  // Prepare data for the bar charts
  const ordersData = [totalOrders];
  const revenueData = [totalSales];

  // Bar chart data for total orders
  const ordersChartData = {
    labels: ['Total Orders'],
    datasets: [
      {
        label: 'Total Orders',
        data: ordersData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Bar chart data for total sales (revenue)
  const revenueChartData = {
    labels: ['Total Sales ($)'],
    datasets: [
      {
        label: 'Total Sales ($)',
        data: revenueData,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Total Orders and Sales',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Function to handle product tile click
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  // Set to track product names and avoid duplicates
  const productNames = new Set();

  // Group products by product-id and sum the order count
  const productOrderCounts = data.sold_products.reduce((acc, product) => {
    const productId = product["product-id"]?.S;
    const orderCount = product.order_count || 0;

    if (acc[productId]) {
      acc[productId] += orderCount;  // Sum the order counts for the same product-id
    } else {
      acc[productId] = orderCount;
    }

    return acc;
  }, {});

  return (
    <div style={{ padding: '20px' }}>
      <h1>Analytics Page</h1>
      <div style={{ margin: '20px 0' }}>
        <h2>Provider Performance</h2>
        <p>Provider ID: {data.provider_id}</p>
      </div>

      {/* Flexbox Layout for horizontal chart display */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
        <div style={{ flex: 1, marginRight: '20px' }}>
          <h3>Total Orders</h3>
          <Bar data={ordersChartData} options={chartOptions} />
        </div>
        <div style={{ flex: 1, marginLeft: '20px' }}>
          <h3>Total Sales ($)</h3>
          <Bar data={revenueChartData} options={chartOptions} />
        </div>
      </div>

      {/* Product Tiles */}
      <div style={{ marginTop: '40px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {data.sold_products?.map((product) => {
          const productName = product.name?.S || 'Unknown Product';

          // If no product name or product name is already added, skip this product
          if (productNames.has(productName)) {
            return null;
          }

          // Add product name to the set
          productNames.add(productName);

          // Get the total order count for the product using the grouped data
          const productId = product["product-id"]?.S;
          const totalProductOrders = productOrderCounts[productId] || 0;

          // Function to render stars based on the rating
          const renderStars = (rating) => {
            const totalStars = 5;  // Max number of stars
            const filledStars = Math.round(rating); // Round the rating to the nearest integer

            return Array.from({ length: totalStars }, (_, index) => (
              <span key={index} style={{ color: index < filledStars ? '#f39c12' : '#ddd' }}>
                &#9733; {/* Unicode for a star character */}
              </span>
            ));
          };

          return (
            <div
              key={productName}
              onClick={() => handleProductClick(product)}
              style={{
                width: '280px',
                backgroundColor: '#f4f4f4',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textAlign: 'center',
                color: 'black', // Font color set to black
                transition: 'transform 0.3s ease',
                margin: '10px',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <img
                src={product.imgUrl?.S || 'https://via.placeholder.com/150'}
                alt={productName}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  objectFit: 'contain',
                  marginBottom: '15px',
                }}
              />
              <div style={{ marginTop: '10px' }}>
                <strong
                  style={{
                    fontSize: '1.2em',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '10px',
                    textAlign: 'center',
                  }}
                >
                  {productName}
                </strong>
                <p
                  style={{
                    fontSize: '1.1em',
                    fontWeight: 500,
                    color: '#27ae60',
                    marginBottom: '8px',
                    textAlign: 'center',
                  }}
                >
                  ${product.price?.S || '0.00'}
                </p>
                {/* Styled Orders count */}
                <p
                  style={{
                    fontSize: '1em',
                    fontWeight: 'bold',
                    color: '#fff',
                    backgroundColor: '#e74c3c',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    marginBottom: '8px',
                    display: 'inline-block',
                    textAlign: 'center',
                    width: 'auto',
                  }}
                >
                  Orders: {totalProductOrders}
                </p>
                <p
                  style={{
                    fontSize: '1em',
                    fontWeight: 'bold',
                    color: '#fff',
                    backgroundColor: '#3498db',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    marginBottom: '8px',
                    display: 'inline-block',
                    textAlign: 'center',
                    width: 'auto',
                    marginLeft: '15px'
                  }}
                >
                  Revenue: {totalProductOrders * (product.price?.S || 0)}
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '10px',
                  }}
                >
                  {renderStars(product.average_rating || 0)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedProduct(null)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '80%',
              boxSizing: 'border-box',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedProduct.name?.S}</h2>
            <p style={{color: 'black'}}>Price: ${selectedProduct.price?.S}</p>
            <p style={{color: 'black'}}>Total Orders: {selectedProduct.order_count}</p>
            <p style={{color: 'black'}}>Summary: {reviewSummary}</p>
            <button onClick={() => setSelectedProduct(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;