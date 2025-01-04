import React, { useState, useEffect, useContext } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./Cart.css";
import AuthContext from "../components/AuthContext";
import { Alert, Snackbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

function CartPage() {
  const navigate = useNavigate(); // React Router's hook for navigation
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const cardStyle = {
    style: {
      base: {
        color: "#ffffff", // White text
        "::placeholder": {
          color: "#bbbbbb", // Light gray placeholder
        },
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        iconColor: "#ffffff", // White icons
        "::selection": {
          backgroundColor: "#5a67d8", // Highlight color
        },
      },
      invalid: {
        color: "#ff5252", // Red text for invalid input
        iconColor: "#ff5252",
      },
    },
  };

  const { isAuthenticated, userDetails } = useContext(AuthContext);
  const userSub = userDetails?.sub;

  const [removingItemId, setRemovingItemId] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  const API_URL =
    "https://32gw38lfe0.execute-api.ca-central-1.amazonaws.com/default/stripe-lambda/payment";

  useEffect(() => {
    // If the user is authenticated, fetch their cart items from the API
    if (isAuthenticated && userSub) {
      fetchCartItems(userSub);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, userSub]);

  const fetchCartItems = async (userSub) => {
    try {
      const response = await fetch(
        `https://p3aqkfift3.execute-api.ca-central-1.amazonaws.com/Cart/Cart?userName=${userSub}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      const data = await response.json();
      setItems(data.cartItems || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const calculateTotal = () => {
    return items
      .reduce((total, item) => total + parseFloat(item.price), 0)
      .toFixed(2);
  };

  const handleRemove = async (productId) => {
    setRemovingItemId(productId); // Trigger animation

    try {
      const response = await fetch(
        `https://p3aqkfift3.execute-api.ca-central-1.amazonaws.com/Cart/Cart?userName=${userSub}&productIds=${productId}`, // Send single productId as list
        { method: "DELETE" }
      );

      if (!response.ok) {
        setAlert({
          open: true,
          message: "Failed to remove item from cart",
          severity: "error",
        });
        throw new Error("Failed to remove item from cart");
      }

      setTimeout(() => {
        setItems((prevItems) =>
          prevItems.filter((item) => item.productId !== productId)
        );
        setRemovingItemId(null); // Reset state
        setAlert({
          open: true,
          message: "Item removed from cart",
          severity: "success",
        });
      }, 500);
    } catch (err) {
      console.error(err.message);
      setAlert({
        open: true,
        message: "Failed to remove item from cart",
        severity: "error",
      });
      setRemovingItemId(null); // Reset state on error
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setProcessingPayment(true);
    setPaymentResult(null);

    const requestData = {
      amount: parseInt(calculateTotal() * 100), // Convert to cents
      currency: "cad",
      description: "Payment for cart items",
      receipt_email: userDetails?.email || "customer@example.com",
      metadata: {
        userSub: userSub,
        productIds: items.map((item) => item.productId).join(","),  // Convert to a comma-separated string
      },
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: JSON.stringify(requestData) }),
      });

      const data = await response.json();
      const parsedData = JSON.parse(data.body);
      const { client_secret } = parsedData;

      if (!client_secret) {
        setAlert({
          open: true,
          message: "Client Secret is missing from backend response",
          severity: "error",
        });
        throw new Error("Client Secret is missing from backend response");
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        setAlert({ open: true, message: error.message, severity: "error" });
        setPaymentResult({ error: error.message });
      } else if (paymentIntent.status === "succeeded") {
        const productIds = items.map((item) => item.productId).join(","); // Convert to comma-separated list
        const response = await fetch(
          `https://p3aqkfift3.execute-api.ca-central-1.amazonaws.com/Cart/Cart?userName=${userSub}&productIds=${productIds}`,
          { method: "DELETE" }
        );

        if (!response.ok) {
          setAlert({
            open: true,
            message: "Failed to clear cart after payment",
            severity: "error",
          });
          throw new Error("Failed to clear cart after payment");
        }

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

        const postOrdersResponse = await fetch(
          `https://3ue0gb6b99.execute-api.ca-central-1.amazonaws.com/default/create-orders`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userName: userSub,
              productId: productIds, // Send as an array of product IDs
            }),
          }
        );
  
        if (!postOrdersResponse.ok) {
          setAlert({
            open: true,
            message: "Failed to save orders after payment",
            severity: "error",
          });
          throw new Error("Failed to save orders after payment");
        }

        setAlert({
          open: true,
          message: "Payment succeeded!",
          severity: "success",
        });


        setItems([]); // Clear cart state on frontend
        setPaymentResult({ success: "Payment succeeded! Redirecting..." });
        setTimeout(() => { navigate("/orders"); }, 2000); // Redirect to orders page
        
      }
    } catch (error) {
      console.error("Error during payment:", error);
      setAlert({ open: true, message: "Payment failed", severity: "error" });
      setPaymentResult({ error: "Payment failed" });
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="cart-container">
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Add this line
      >
        <Alert
          onClose={handleCloseAlert}
          variant="filled"
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
      <h1>Your Shopping Cart</h1>
      {items.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div
                className={`cart-item ${
                  removingItemId === item.productId ? "cart-item-removing" : ""
                }`}
                key={item.productId}
              >
                <img
                  src={item["title-image"]}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                </div>
                <div className="cart-item-actions">
                  <span className="cart-item-price">${item.price}</span>
                  <button
                    className="remove-button"
                    onClick={() => handleRemove(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="total-container">
            <span className="total-text">Total:</span>
            <span className="total-amount">${calculateTotal()}</span>
          </div>
          <div className="payment-section">
            <CardElement options={cardStyle}/>
            <button
              className="payment-button"
              onClick={handlePayment}
              disabled={processingPayment}
            >
              {processingPayment ? "Processing..." : "Buy Now"}
            </button>
          </div>
          {paymentResult && (
            <div className="payment-result">
              {paymentResult.error ? (
                <div className="error-message">{paymentResult.error}</div>
              ) : (
                <div className="success-message">{paymentResult.success}</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CartPage;
