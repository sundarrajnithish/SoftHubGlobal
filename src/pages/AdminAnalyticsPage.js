import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import './AdminAnalyticsPage.css';
import LoadingSpinner from '../components/LoadingSpinner'; 

const AdminAnalyticsPage = () => {
  const salesChartRef = useRef(null);
  const revenueChartRef = useRef(null);
  const usersChartRef = useRef(null);
  const trafficChartRef = useRef(null);

  const labels = ["Jan", "Feb", "Mar", "Apr", "May"];
  const salesData = [20, 40, 30, 50, 60];
  const revenueData = [500, 1000, 1500, 2000, 2500];
  const usersData = [5, 15, 10, 20, 30];
  const trafficData = [300, 400, 500, 700, 600];

  const [email, setEmail] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [status, setStatus] = useState('');
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [successPopupVisible, setSuccessPopupVisible] = useState(false); // New state for success popup
  const [loading, setLoading] = useState(false);

  const destroyChart = (chartRef) => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
  };

  useEffect(() => {
    destroyChart(salesChartRef);
    salesChartRef.current = new Chart(document.getElementById("salesChart"), {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Sales',
            data: salesData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      },
    });

    destroyChart(revenueChartRef);
    revenueChartRef.current = new Chart(document.getElementById("revenueChart"), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Revenue',
            data: revenueData,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            fill: false,
          },
        ],
      },
    });

    destroyChart(usersChartRef);
    usersChartRef.current = new Chart(document.getElementById("usersChart"), {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: 'Users',
            data: usersData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)'
            ],
          },
        ],
      },
    });

    destroyChart(trafficChartRef);
    trafficChartRef.current = new Chart(document.getElementById("trafficChart"), {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            label: 'Traffic',
            data: trafficData,
            backgroundColor: [
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)'
            ],
          },
        ],
      },
    });

    return () => {
      destroyChart(salesChartRef);
      destroyChart(revenueChartRef);
      destroyChart(usersChartRef);
      destroyChart(trafficChartRef);
    };
  }, []);

  const handleSearch = async () => {
    if (!email) {
      alert('Please enter an email ID.');
      return;
    }
    console.log('Setting loading to true');
    setLoading(true);
    try {
      const response = await fetch(`https://0soum3zemc.execute-api.ca-central-1.amazonaws.com/dev/users?email=${email}`);
      const result = await response.json();
      const user = JSON.parse(result.body)[0];
      setUserDetails({
        username: user.Username,
        email: user.Attributes.email,
        emailVerified: user.Attributes.email_verified,
        role: user.Attributes['custom:role'],
        status: user.Attributes['custom:status'] || 'active',
      });
      setStatus(user.Attributes['custom:status'] || 'active');
    } catch (error) {
      console.error('Error fetching user details:', error);
    }finally {
      setLoading(false);
      console.log('Setting loading to false');
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setShowSubmitButton(true);
  };

  const handleSubmit = () => {
    setConfirmationVisible(true);
  };


  const confirmStatusChange = async () => {
    setConfirmationVisible(false);
    setLoading(true);
    if (!userDetails) {
      console.error("User details not found. Cannot update status.");
      return;
    }
    const payload = {
      body: JSON.stringify({
        username: userDetails.username,
        status: status,
      }),
    };
    try {
      const response = await fetch(`https://f6ju1edah5.execute-api.us-east-1.amazonaws.com/dev/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setShowSubmitButton(false);
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          status: status,
        }));
        setSuccessPopupVisible(true); // Show success popup
      } else {
        alert('Failed to update status.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analytics-page">
      <h2>Admin Dashboard</h2>
      {loading && <LoadingSpinner />}
      <div className="grid-container">
        <div className="chart-container animated"><canvas id="salesChart"></canvas></div>
        <div className="chart-container animated"><canvas id="revenueChart"></canvas></div>
        <div className="chart-container animated"><canvas id="usersChart"></canvas></div>
        <div className="chart-container animated"><canvas id="trafficChart"></canvas></div>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {userDetails && (
        <div className="user-details">
          <h3>User Details</h3>
          <p><strong>Username:</strong> {userDetails.username}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
          <p><strong>Email Verified:</strong> {userDetails.emailVerified}</p>
          <p><strong>Role:</strong> {userDetails.role}</p>
          <p><strong>Status:</strong> {userDetails.status}</p>

          <div className="status-container">
            <label htmlFor="status-select">Change Status:</label>
            <select
              id="status-select"
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {showSubmitButton && (
            <button className="submit-button" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      )}

      {confirmationVisible && (
        <div className="confirmation-modal">
          <p>Are you sure you want to {status === 'suspended' ? 'suspend' : 'activate'} the user account?</p>
          <button className="confirm-button" onClick={confirmStatusChange}>
            Yes
          </button>
          <button className="cancel-button" onClick={() => setConfirmationVisible(false)}>
            No
          </button>
        </div>
      )}

      {successPopupVisible && (
        <div className="success-popup">
          <p>User status has been successfully updated.</p>
          <button className="ok-button" onClick={() => setSuccessPopupVisible(false)}>
            OK
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminAnalyticsPage;
