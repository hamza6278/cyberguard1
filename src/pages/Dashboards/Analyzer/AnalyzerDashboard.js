import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

function AnalyzerDashboard() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    // Check for authentication; if not authenticated, redirect to login
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const storedFullName = localStorage.getItem('full_name');
    
    if (!isAuthenticated) {
      navigate('/'); // Ensure this route is correct for your login page
    } else if (storedFullName) {
      setFullName(storedFullName);
    }
  }, [navigate]);

  // Handler functions for navigating within the dashboard
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('full_name');
    navigate('/'); // Redirect to login after logout
  };

  const handleNavigate = (path) => () => {
    navigate(path);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div className="sidebar" style={{ width: '20%', backgroundColor: '#333435', height: '100vh' }}>
        <div style={{ textAlign: 'center', marginTop: '0', marginBottom: '1em' }}>
          <img
            src="cyberguard1.jpg"
            alt="Admin Dashboard"
            width="230"
          />
        </div>
        <ul className='button-container'>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '5em', height: '80vh' }}>
            <h3>Welcome, {fullName}!</h3>
            <button onClick={handleNavigate('/analyzer_notifications')} style={{ marginBottom: '2em' }}>Notifications</button>
            <button onClick={handleNavigate('/analyzer/generateHash')} style={{ marginBottom: '2em' }}>Generate Hash</button>
            <button onClick={handleNavigate('/analyzer/vtPage')} style={{ marginBottom: '2em' }}>Check Result in VT</button>
            <button onClick={handleLogout} style={{ marginTop: '0', marginBottom: '2em' }}>Logout</button>
            {/* <button onClick={handleNavigate('/analyzer/viewSoftware')} style={{ marginBottom: '2em' }}>View Software</button> */}
            {/* <button onClick={handleNavigate('/analyzer/viewResult')} style={{ marginBottom: '2em' }}>View Result</button> */}
            {/* <button onClick={handleLogout} style={{ marginTop: 'auto', marginBottom: '2em' }}>Logout</button> */}
          </div>
        </ul>
      </div>
      <div style={{ marginLeft: '20%', width: '80%', padding: '20px' }}>
        <h2>Analyzer Dashboard</h2>
        {/* Place more dashboard content here */}
      </div>
    </div>
  );
}

export default AnalyzerDashboard;
