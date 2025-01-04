import React, { useState, useEffect, useContext } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from "react-router-dom";
import './Checkout.css';
import AuthContext from '../components/AuthContext';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // React Router's hook for navigation
  const { productDetails } = location.state || {};
  const [paymentResult, setPaymentResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(''); // Track payment status

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { isAuthenticated, userDetails } = useContext(AuthContext);
  const userSub = userDetails?.sub;

  const stripe = useStripe();
  const elements = useElements();

  const PAYMENT_API_URL = 'https://32gw38lfe0.execute-api.ca-central-1.amazonaws.com/default/stripe-lambda/payment';
  const ORDER_API_URL = 'https://3ue0gb6b99.execute-api.ca-central-1.amazonaws.com/default/create-orders';

  useEffect(() => {
    if (productDetails) {
      fetchClientSecret();
    }
  }, [productDetails]);

  const fetchClientSecret = async () => {
    const requestData = {
      amount: parseInt(productDetails.price * 100),
      currency: 'cad',
      description: `${productDetails.name} - ${productDetails.id} - ${productDetails.description}`,
      receipt_email: userDetails?.email || "customer@example.com",
      metadata: {
        userSub: userSub,
        productIds: productDetails.id,
      },
    };

    try {
      const response = await fetch(PAYMENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: JSON.stringify(requestData) }),
      });

      const data = await response.json();
      const parsedData = JSON.parse(data.body);
      const { client_secret } = parsedData;

      if (!client_secret) {
        throw new Error('Client Secret is missing from backend response');
      }
      
      setClientSecret(client_secret);
    } catch (error) {
      console.error('Error fetching client secret:', error);
      setPaymentResult({ error: 'Failed to initialize payment.' });
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setPaymentResult(null);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        setPaymentResult({ error: error.message });
        setPaymentStatus('failed');
      } else if (paymentIntent.status === 'succeeded') {
        setPaymentResult({ success: 'Payment succeeded!' });
        setPaymentStatus('success');

        console.log('Payment succeeded:', paymentIntent);

        const postEmail = await fetch(
          `https://3dov43u3m3.execute-api.ca-central-1.amazonaws.com/dev/email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userDetails?.email,
            }),
          }
        );

        console.log("email sent to: ", userDetails?.email);
  
        if (!postEmail.ok) {
          setAlert({
            open: true,
            message: "Failed to send email after payment",
            severity: "error",
          });
          throw new Error("Failed to send email after payment");
        }

        // Post to the order API
        const orderData = {
          userName: userSub,
          productId: productDetails.id,
        };

        try {
          const response = await fetch(ORDER_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
          });

          if (!response.ok) {
            throw new Error(`Failed to post order: ${response.statusText}`);
          }

          console.log('Order posted successfully');
          navigate('/orders'); // Redirect to orders page
        } catch (postError) {
          console.error('Error posting order:', postError);
          setPaymentResult({ error: 'Order creation failed after payment. Please contact support.' });
        }
      }
    } catch (error) {
      console.error('Error during payment:', error);
      setPaymentResult({ error: 'Payment failed.' });
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <p>Product: {productDetails ? productDetails.name : 'Loading...'}</p>
      <p>Price: ${productDetails ? productDetails.price : 'Loading...'}</p>
      <img src={productDetails ? productDetails.image : ''} alt={productDetails ? productDetails.name : ''} />

      <div className="payment-section">
        {clientSecret && (
          <>
            <CardElement />
            <button 
              onClick={handlePayment} 
              disabled={loading || !stripe || !elements}
              className={`pay-button ${paymentStatus === 'success' ? 'success' : paymentStatus === 'failed' ? 'failed' : ''}`}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </>
        )}
      </div>

      {paymentResult && (
        <div className="payment-result">
          {paymentResult.error ? (
            <pre style={{ color: 'red' }}>{paymentResult.error}</pre>
          ) : (
            <pre style={{ color: 'green' }}>{paymentResult.success} Redirecting...</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
