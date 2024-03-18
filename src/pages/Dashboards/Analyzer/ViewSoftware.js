
// Create a new React component (e.g., SoftwareCredentialsPage.js)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


function SoftwareCredentialsPage() {
  const [credentials, setCredentials] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3028/softwarecredentials')
      .then((response) => response.json())
      .then((data) => {
        // Check if 'softwarecredentials' is an array before setting state
        if (Array.isArray(data.softwarecredentials)) {
          setCredentials(data.softwarecredentials);
        } else {
          console.error('Invalid data format: softwarecredentials is not an array');
        }
      })
      .catch((error) => {
        console.error('Error fetching software credentials:', error);
      });
  }, []);

  return (
    <div className="software-credentials-container">
      <h2>Software To be Tested</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Folder Name</th>
            <th>Functionality</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {credentials.map((credential, index) => (
            <tr key={index}>
              <td>{credential.date}</td>
              <td>{credential.folderName}</td>
              <td>{credential.functionality}</td>
              <td>{credential.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/analyzer/page1">
        <button>Generate Hash</button>
      </Link>
    </div>
  );
}

export default SoftwareCredentialsPage;
