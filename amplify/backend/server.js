const express = require('express');
const stripe = require('stripe')('sk_test_51QK8A7IKDma6OOXzuPSKVIu8gKwaUY1Wps3ARjTVDafSuU8MrALjVRLUiYePEhNDcFJcvBCY2EsQT4rNrO9VutEt00W4ndCCtg'); // Replace with your actual Stripe secret key
const bodyParser = require('body-parser');

const app = express();
const port = 5000;  // You can use any available port

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to create Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
  const { productId } = req.body; // Product ID from the frontend

  // Example product price in cents (replace with actual logic for pricing)
  const productPriceInCents = 1999;  // Example price: $19.99

  try {
    // Create a Payment Intent with the product price
    const paymentIntent = await stripe.paymentIntents.create({
      amount: productPriceInCents,  // Price in cents
      currency: 'usd',  // Currency
    });

    // Send the client secret back to the frontend
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send('Error creating payment intent');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
