import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SupervisorDashboard() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    // Retrieve full_name from local storage
    const storedFullName = localStorage.getItem('full_name');
    if (storedFullName) {
      setFullName(storedFullName);
    }
    
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

  const handleGenerateRemarksClick = () => {
    // Redirects to the GenerateRemarksPage in the Supervisor Dashboard
    navigate('/supervisor/generateRemarks'); // Assuming this is the correct route
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
          // style={{ display: 'block', margin: '0 auto', padding: '0', height: '130px' }}
        />
      </div>

      <ul className='button-container'>
        <h3>Welcome, {fullName}!</h3>
        {/* Single button for generating remarks */}
        <button onClick={handleGenerateRemarksClick} style={{ width: '150px', marginBottom: '2em' }}>Generate Remarks</button>
        <button onClick={() => navigate("/supervisor_notifications")} style={{ width: '150px', marginBottom: '2em' }}>Notifications</button>
        <button onClick={handleLogout} style={{ width: '150px', padding: '10px', marginBottom: '2em', cursor: 'pointer' }}>Logout</button>
        </ul>

      <div style={{ marginLeft: '20%' }}>
        {/* Other components for Supervisor Dashboard */}
        {/* <h2>Supervisor Dashboard</h2> */}

        {/* You can add other components or information specific to the Supervisor Dashboard here */}
      </div>
    </div>
  );
}

export default SupervisorDashboard;
