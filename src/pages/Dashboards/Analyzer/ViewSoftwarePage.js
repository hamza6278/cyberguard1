import React from 'react';
import { useSoftwareData } from './pages/Dashboards/SoftwareDataContext'; // Import the hook to access shared data
import './ViewSoftwarePage.css';

function ViewSoftwarePage() {
  const { softwareData } = useSoftwareData(); // Access the shared data

  return (
    <div className="center-container">
      <div className="view-software-container">
        <h2>View Submitted Software</h2>
        <div className="software-details">
          {softwareData.map((data, index) => (
            <div key={index} className="software-entry">
              <p><strong>Software Name:</strong> {data.softwareName}</p>
              <p><strong>Date:</strong> {data.date}</p>
              <p><strong>Designation:</strong> {data.contact}</p>
              <p><strong>Functionality:</strong> {data.functionality}</p>
              <p><strong>Department:</strong> {data.department}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewSoftwarePage;
