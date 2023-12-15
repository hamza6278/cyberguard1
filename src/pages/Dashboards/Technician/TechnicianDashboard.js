import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();

  const handleSoftwareTestingClick = () => {
    navigate('/technician/SoftwareTestingPage');
  };

  return (
    <div className="sidebar" style={{  width: '20%', backgroundColor: 'white"' }}>
      <div style={{ textAlign: 'center', marginTop: '0px' }}>
        <img
          src="cyberguard1.jpg"
          alt="Software Test"
          width="230"
          style={{ display: 'block', margin: '0 auto', margin: '0', padding: '0', height: '130px' }}
        />
      </div>
      <ul>
      <button onClick={handleSoftwareTestingClick} style={{ marginBottom: '2em',  }}>Software Entry</button>
        
        <Link to="/technician/duplicate">
          <button style={{ marginBottom: '2em' }}>Check Duplicates</button>
        </Link>

        

        <Link to="/technician/duplicate">
          <button style={{ marginBottom: '2em' }}>Book Appointment</button>
        </Link>
{/*
        <Link to="/tested-software">
          <button style={{ marginBottom: '2em' }}>Tested Software</button>
        </Link>
  */}
        
      </ul>
    </div>
  );
}

export default Sidebar;
