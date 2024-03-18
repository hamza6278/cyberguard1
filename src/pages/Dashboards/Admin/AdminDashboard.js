import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationContext from '../../../context/NotificationContext'; // Adjust the path based on your project structure
//import { useState, useEffect } from 'react';


function AdminSidebar() {
  const navigate = useNavigate();
  const { notifications } = useContext(NotificationContext);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

  

  // Log received notifications
  useEffect(() => {
    console.log('Received Notifications:', notifications);
  }, [notifications]);

  const handleViewPasswordsClick = () => {
    navigate('/admin/viewPasswords');
  };

  const handleRegisterUserClick = () => {
    navigate('/admin/registerUser');
  };

  const handleApproveUserClick = () => {
    navigate('/admin/approveUser');
  };

  // New button handler to navigate to the "Add API" page
  const handleAddApiClick = () => {
    navigate('/admin/addApi');
  };

  const handleLogout = () => {
    // Clear session storage (or local storage) and redirect to login
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('full_name');
    navigate('/');
  };


  return (
    <div className="sidebar" style={{ float: 'left', width: '20%', backgroundColor: '#333435', height: '100vh' }}>
      <div style={{ textAlign: 'center', marginTop: '0', marginBottom: '1em' }}>
        <img
          src="cyberguard1.jpg" // Replace with your admin dashboard image
          alt="Admin Dashboard"
          width="230"
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '5em', height: '80vh' }}>
        <h3>Welcome, {fullName}!</h3>
        {/* <button onClick={handleViewPasswordsClick} style={{ marginBottom: '2em' }}>View Passwords</button> */}
        <button onClick={handleRegisterUserClick} style={{ marginBottom: '2em' }}>Register New User</button>
        <button onClick={handleApproveUserClick} style={{ marginBottom: '2em' }}>Approve User</button>
        <button onClick={handleAddApiClick} style={{ marginBottom: '2em' }}>Add API</button>
        <button onClick={handleLogout} style={{ width: '100%', padding: '10px', marginBottom: '2em', cursor: 'pointer' }}>Logout</button>
        {/* Add more buttons as needed */}
      </div>
      {/* Display notifications */}
      <div>
        <h4>Notifications:</h4>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification.message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminSidebar;
