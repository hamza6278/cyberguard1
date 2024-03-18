import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function NotificationAnalyzer() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState();
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const storedFullName = localStorage.getItem('full_name');
    console.log(storedFullName)

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/'); // Update with your login route
    } else {
      setFullName(storedFullName);

      // Fetch notifications if authenticated
      const fetchNotifications = async () => {
        try {
          const response = await axios.get('http://localhost:3028/analyzer_notifications');
          setNotifications(response.data.filter(notification => notification.analyzeAcc === storedFullName))
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchNotifications();
    }
  }, [navigate]);

  const handleButton2Click = () => {
    navigate('/analyzer/generateHash');
  };

  const handleViewSoftwareClick = () => {
    navigate('/analyzer/viewSoftware');
  };

  const handleViewResultClick = () => {
    navigate('/analyzer/viewResult');
  };

  const handleCheckVTClick = () => {
    navigate('/analyzer/vtPage');
  };

  const handleBackToDashboardClick = () => {
    navigate('/analyzer/analyzerdashboard');  // Relative path to AnalyzerDashboard.js
  };

  const handleNavigate = (path) => () => {
    navigate(path);
  };

  const handleLogout = () => {
    // Clear session storage (or local storage) and redirect to login
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('full_name');
    navigate('/');
  };

  return (
    <div className="page-container" style={{ display: 'flex', height: '100vh' }}>
      <div className="sidebar" style={{ width: '20%', backgroundColor: '#333435', padding: '10px', height: '100vh' }}>
        <div style={{ textAlign: 'center', marginTop: '0', marginBottom: '1em' }}>
          <img src="cyberguard1.jpg" alt="Admin Dashboard" width="230" />
        </div>
        <ul className='button-container'>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '5em', height: '80vh' }}>
            <h3>Welcome, {fullName}!</h3>
            <button onClick={handleNavigate('/analyzer_notifications')} style={{ marginBottom: '2em' }}>Notifications</button>
            <button onClick={handleButton2Click} style={{ marginBottom: '2em' }}>Generate Hash</button>
            <button onClick={handleCheckVTClick} style={{ marginBottom: '2em' }}>Check Result in VT</button>
            {/* <button onClick={handleViewSoftwareClick} style={{ marginBottom: '2em' }}>View Software</button> */}
            {/* <button onClick={handleViewResultClick} style={{ marginBottom: '2em' }}>View Result</button> */}
            <button onClick={handleBackToDashboardClick}>Back to Dashboard</button>
            <button onClick={handleLogout} style={{ width: '100%', padding: '10px', marginBottom: '2em', cursor: 'pointer' }}>Logout</button>
          </div>
        </ul>
      </div>
      <div style={{ flex: 1, padding: '10px' }}>
        <h1 style={{ marginTop: '0' }}>NOTIFICATIONS</h1>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Contact</th>
              <th>Functionality</th>
              <th>Department</th>
              <th>LetterId</th>
              <th>Software Name</th>
              <th>Remarks</th>
              <th>location</th>
            </tr>
          </thead>
          <tbody>
            {notifications?.map((notification, index) => (
              <tr key={index}>
                <td>{notification.date}</td>
                <td>{notification.contact}</td>
                <td>{notification.functionality}</td>
                <td>{notification.department}</td>
                <td>{notification.letterID}</td>
                <td>{notification.softwareName}</td>
                <td>{notification.remarks}</td>
                <td>{notification.folderLocation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NotificationAnalyzer;
