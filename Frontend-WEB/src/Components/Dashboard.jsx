import React, { useState, useEffect } from 'react';
import api from '../api';
import '../Styling/Dashboard.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [tools, setTools] = useState([]);
  const [tips, setTips] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, userRes, toolsRes, tipsRes] = await Promise.all([
          api.get('/dashboard/'),
          api.get('/auth/user/'),
          api.get('/tools/'),
          api.get('/tips/'),
        ]);
        setDashboardData(dashboardRes.data);
        setUser(userRes.data);
        setTools(toolsRes.data);
        setTips(tipsRes.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    const getWeather = () => {
      const errorCallback = (error) => {
        console.error("Error getting location", error);
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m`);
            setWeather(weatherRes.data);
          } catch (err) {
            console.error("Error fetching weather", err);
          }
        }, errorCallback);
      }
    };

    fetchData();
    getWeather();
  }, []);

  const formatWeatherData = (weather) => {
    if (!weather || !weather.hourly) return [];
    return weather.hourly.time.map((time, index) => ({
      time: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: weather.hourly.temperature_2m[index],
    })).slice(0, 24); // Get first 24 hours
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome to your Dashboard, {user?.username}!</h1>
        <p>Here's a summary of your farm's status.</p>
      </header>
      <main className="dashboard-main">
        <div className="dashboard-grid">
          <div className="card">
            <h3>Profile</h3>
            <p>View and edit your profile information.</p>
            <Link to="/profile"><button>Go to Profile</button></Link>
          </div>
          <div className="card">
            <h3>Crop Recommendations</h3>
            {dashboardData?.recommendation ? (
              <div>
                <p>Your latest recommended crop is: <strong>{dashboardData.recommendation.predicted_crop}</strong></p>
                <p>Based on N={dashboardData.recommendation.N}, P={dashboardData.recommendation.P}, K={dashboardData.recommendation.K}</p>
              </div>
            ) : (
              <p>No crop recommendations available yet.</p>
            )}
            <button>View Recommendations</button>
          </div>
          <div className="card">
            <h3>Weather Forecast</h3>
            {weather ? (
              <div>
                <p>Temperature: {weather.current_weather.temperature}°C</p>
                <p>Windspeed: {weather.current_weather.windspeed} km/h</p>
                <LineChart width={500} height={300} data={formatWeatherData(weather)}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </div>
            ) : (
              <p>Fetching weather data...</p>
            )}
            <Link to="/weather"><button>View Forecast</button></Link>
          </div>
          <div className="card">
            <h3>Farming Activities</h3>
            {dashboardData?.activities.length > 0 ? (
              <ul>
                {dashboardData.activities.map(activity => (
                  <li key={activity.id}>{activity.activity.task} - {activity.status}</li>
                ))}
              </ul>
            ) : (
              <p>No farming activities yet.</p>
            )}
            <button>Manage Activities</button>
          </div>
          <div className="card">
            <h3>Tools and Resources</h3>
            <h4>Tools</h4>
            {tools.length > 0 ? (
              <ul>
                {tools.map(tool => (
                  <li key={tool.id}>{tool.name}</li>
                ))}
              </ul>
            ) : (
              <p>No tools available.</p>
            )}
            <h4>Tips</h4>
            {tips.length > 0 ? (
              <ul>
                {tips.map(tip => (
                  <li key={tip.id}>{tip.title}</li>
                ))}
              </ul>
            ) : (
              <p>No tips available.</p>
            )}
            <button>Access Tools</button>
          </div>
          <div className="card">
            <h3>Community Forum</h3>
            <p>Connect with other farmers and experts.</p>
            <Link to="/forum"><button>Join Forum</button></Link>
          </div>
        </div>
      </main>
    </div>
  );
}