import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext'; // Adjust the path based on your project structure
import './OrdersPage.css';

const OrdersPage = () => {
  const { isAuthenticated, userDetails } = useAuth();
  const userSub = userDetails?.sub; // `sub` should be part of `userDetails` fetched from `fetchUserAttributes`.

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userSub) return; // Ensure we have a userSub before making the API call

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `https://3ue0gb6b99.execute-api.ca-central-1.amazonaws.com/default/get-client-order?userName=${userSub}`
        );
        console.log(response);
        if (!response.ok) {
          throw new Error(`Error fetching orders: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Orders Data:', data); // Log data to see the structure
        setOrders(data.cartItems || []); // Adjust to your API's structure
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [userSub]);

  if (!isAuthenticated) {
    return <div>Please log in to view your orders.</div>;
  }

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="orders-container">
      <h1>Orders</h1>
      <div className="orders-items">
        {orders.length === 0 ? (
          <div className="empty-orders">No orders found.</div>
        ) : (
          orders.map((order) => (
            <div key={order.productId} className="order-item">
              <img
                src={order['title-image']}
                alt={order.name}
                className="order-item-image"
              />
              <div className="order-item-details">
                <div className="order-item-name">{order.name}</div>
                <div className="order-item-price">Price: ${order.price}</div>
              </div>
            </div>
          ))
        )}
      </div>
      {orders.length > 0 && (
        <div className="total-container">
          <div className="total-text">Total Orders Value: </div>
          <div className="total-amount">
            $
            {orders
              .reduce((acc, order) => acc + parseFloat(order.price), 0)
              .toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
