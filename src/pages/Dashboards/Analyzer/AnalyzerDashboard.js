import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';

function AnalyzerDashboard() {
  const navigate = useNavigate();

  const handleButton1Click = () => {
    navigate('/analyzer/page1');
  };

  const handleButton2Click = () => {
    navigate('/analyzer/page2');
  };

  const handleButton3Click = () => {
    navigate('/analyzer/page3');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
    <div className="sidebar" style={{ float: 'left', width: '20%', backgroundColor: '#333435' }}>
      <div style={{ textAlign: 'center', marginTop: '0px' }}>
        <img
          src="cyberguard1.jpg"
          alt="Software Test"
          width="230"
          style={{ display: 'block', margin: '0 auto', margin: '0', padding: '0', height: '130px' }}
        />
        </div>
        
        <ul className='button-container'>
          <button onClick={handleButton1Click} style={{ marginBottom: '2em' }}>Generate Hash</button>
          <button onClick={handleButton2Click} style={{ marginBottom: '2em' }}>Check Duplicacy</button>
          <button onClick={handleButton3Click} style={{ marginBottom: '2em' }}>Tested Software</button>
        </ul>
        
      </div>
      <div style={{ marginLeft: '20%' }}>
        {/* Other components for Analyzer Dashboard */}
        <h2>Analyzer Dashboard</h2>
      </div>
    </div>
  );
}

export default AnalyzerDashboard;
