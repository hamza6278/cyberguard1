import React, { useState } from 'react';
import axios from 'axios';

function ViewResultPage() {
  const [softwareResults, setSoftwareResults] = useState([]);

  const handleFetchResults = async () => {
    try {
      const response = await axios.get('http://localhost:3028/fetchSoftwareResults');
      setSoftwareResults(response.data); // Update state with fetched data
    } catch (error) {
      console.error('Error fetching software results:', error);
    }
  };

  // Helper function to transform Analysis Result and Status values
  const transformValue = (value) => {
    if (value === '{"status":404}') {
      return 'Not found in VT';
    } else if (value === '404') {
      return 'Not available';
    }
    return value;
  };

  return (
    <div>
      <h2>View Result Page</h2>
      <button onClick={handleFetchResults}>Fetch Software Results</button>
      {/* Display fetched data in a table */}
      <table>
        <thead>
          <tr>
            <th>File Namee</th>
            <th>Directory</th>
            <th>Hash</th>
            <th>Analysis Result</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {softwareResults.map((result, index) => (
            <tr key={index}>
              <td>{result.fileName}</td>
              <td>{result.directory}</td>
              <td>{result.hash}</td>
              <td>{transformValue(result.analysisResult)}</td>
              <td>{transformValue(result.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewResultPage;
