import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styling/WeatherPage.css';

export default function WeatherPage() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getWeather = () => {
      const errorCallback = (error) => {
        console.error("Error getting location", error);
        setError(error);
        setLoading(false);
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`);
            setWeather(weatherRes.data);
            setLoading(false);
          } catch (err) {
            setError(err);
            setLoading(false);
          }
        }, errorCallback);
      } else {
        setError(new Error("Geolocation is not supported by this browser."));
        setLoading(false);
      }
    };

    getWeather();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="weather-page-container">
      <h2>7-Day Weather Forecast</h2>
      {weather && weather.daily && (
        <div className="daily-forecast">
          {weather.daily.time.map((day, index) => (
            <div key={day} className="day-card">
              <h3>{new Date(day).toLocaleDateString([], { weekday: 'long' })}</h3>
              <p>Max Temp: {weather.daily.temperature_2m_max[index]}°C</p>
              <p>Min Temp: {weather.daily.temperature_2m_min[index]}°C</p>
              <p>Weather: {weather.daily.weathercode[index]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    
  );
}
