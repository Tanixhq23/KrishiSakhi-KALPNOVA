import React, { useState, useEffect } from 'react';
import api from '../api';
import '../Styling/Profile.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/user/');
        setUser(res.data);
        setUsername(res.data.username);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSendOTP = async () => {
    try {
      await api.post('/auth/send-username-otp/');
      setOtpSent(true);
      alert('OTP sent to your email!');
    } catch (err) {
      alert('Failed to send OTP.');
    }
  };

  const handleVerifyOTPAndUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/verify-username-otp/', { username, otp });
      setUser(res.data);
      alert('Profile updated successfully!');
      setOtpSent(false);
    } catch (err) {
      alert('Failed to update profile. Invalid OTP or other error.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <p>Email: {user?.email}</p>
      
      {!otpSent ? (
        <div className="profile-form">
          <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <button onClick={handleSendOTP}>Change Username</button>
        </div>
      ) : (
        <form onSubmit={handleVerifyOTPAndUpdate} className="profile-form">
          <label>
            New Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            OTP:
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
          </label>
          <button type="submit">Update</button>
        </form>
      )}
    </div>
  );
}