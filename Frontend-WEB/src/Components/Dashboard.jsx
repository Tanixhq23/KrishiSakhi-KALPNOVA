import React from 'react';
import '../Styling/Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome to your Dashboard</h1>
        <p>Here's a summary of your farm's status.</p>
      </header>
      <main className="dashboard-main">
        <div className="dashboard-grid">
          <div className="card">
            <h3>Profile</h3>
            <p>View and edit your profile information.</p>
            <button>Go to Profile</button>
          </div>
          <div className="card">
            <h3>Crop Recommendations</h3>
            <p>Get personalized crop recommendations.</p>
            <button>View Recommendations</button>
          </div>
          <div className="card">
            <h3>Weather Forecast</h3>
            <p>Check the latest weather updates for your location.</p>
            <button>View Forecast</button>
          </div>
          <div className="card">
            <h3>Farming Activities</h3>
            <p>Manage and track your farming activities.</p>
            <button>Manage Activities</button>
          </div>
          <div className="card">
            <h3>Tools and Resources</h3>
            <p>Access useful farming tools and resources.</p>
            <button>Access Tools</button>
          </div>
          <div className="card">
            <h3>Community Forum</h3>
            <p>Connect with other farmers and experts.</p>
            <button>Join Forum</button>
          </div>
        </div>
      </main>
    </div>
  );
}