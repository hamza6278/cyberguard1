import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const storedFullName = localStorage.getItem('full_name');
    
    if (!isAuthenticated) {
      navigate('/login');
    } else if (storedFullName) {
      setFullName(storedFullName);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('full_name');
    navigate('/'); // Assuming this is your route to the login page
  };

  // Define a consistent style for both buttons
  const buttonStyle = {
    width: '100%', // This makes the button stretch to the full width of its container
    padding: '10px', // Add some padding for better visuals
    marginBottom: '5em', // Keep your existing margin
    cursor: 'pointer', // Change cursor to pointer to indicate it's clickable
  };

  return (
    <div className="sidebar" style={{ float: 'left', width: '20%', backgroundColor: '#333435', height: '100vh' }}>
      <div style={{ textAlign: 'center', marginTop: '0px' }}>
        <img
          src="cyberguard1.jpg"
          alt="Software Test"
          width="230"
          style={{ display: 'block', margin: '0 auto', marginTop: '0', padding: '0', height: '130px' }}
        />
      </div>
      <ul>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0em' }}>
          <h3>Welcome, {fullName}!</h3>
          <Link to="/technician/SoftwareTestingPage" style={{ textDecoration: 'none', marginTop: '5em'  }}>
            <button style={buttonStyle}>Software Entry</button>
          </Link>
          <button onClick={handleLogout} style={buttonStyle}>Logout</button>
        </div>
      </ul>
    </div>
  );
}

export default Sidebar;
