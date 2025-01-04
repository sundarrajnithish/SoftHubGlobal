import React, { useState } from 'react';

function PaymentTest() {
  const [paymentResult, setPaymentResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Replace this URL with your Lambda endpoint
  const API_URL = 'https://32gw38lfe0.execute-api.ca-central-1.amazonaws.com/default/stripe-lambda/payment';

  const handlePayment = async () => {
    setLoading(true);
    setPaymentResult(null);
  
    const requestData = {
      amount: 2000,
      currency: 'usd',
      description: 'OMALE Payment for Order #1234',
      receipt_email: 'bladycore@gmail.com',
    };
  
    try {
      console.log('Sending request data:', requestData);
  
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: JSON.stringify(requestData), // Wrap the data inside a 'body' field
        }), // Convert requestData to a JSON string
      });
  
      const data = await response.json();
      console.log('Received data:', data);
      setPaymentResult(data);
    } catch (error) {
      console.error('Error during payment creation:', error);
      setPaymentResult({ error: 'Failed to create payment' });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={{ padding: '20px' }}>
      <h1>Stripe Payment Test</h1>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Create Payment'}
      </button>
      {paymentResult && (
        <div style={{ marginTop: '20px' }}>
          <h2>Payment Result:</h2>
          <pre>{JSON.stringify(paymentResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default PaymentTest;
