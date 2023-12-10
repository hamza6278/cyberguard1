// DuplicatePage.js


import React, { useState } from 'react';

function DuplicatePage() {
  const [file, setFile] = useState(null);

  const knownHashCodes = [
    'hashcode1',
    'hashcode2',
    'hashcode3',
    // Add more known hash codes here
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const generateHashCode = (data) => {
    // A simplified hash function (not recommended for production)
    const hashCode = data.slice(0, 8); // Example: Use the first 8 characters as a hash
    return hashCode;
  };

  const handleUpload = () => {
    if (file) {
      // Simulate generating a hash code (use a more secure hash function in practice)
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const uploadedHashCode = generateHashCode(data);

        if (knownHashCodes.includes(uploadedHashCode)) {
          alert('Software is already tested.');
        } else {
          alert('Please enter software testing credentials.');
        }
      };
      reader.readAsBinaryString(file);
    } else {
      alert('Please select a file to upload.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',  // Align content at the top
      height: '100vh',
    }}>
      <h2>Software Duplication Check</h2>
      <h3>Please enter your specified Software file for Duplicacy</h3>
      <div style={{
        border: '2px solid black',
        padding: '30px',
        borderRadius: '10px',
        textAlign: 'center',
        marginTop: '60px',
      }}>
        <input type="file" onChange={handleFileChange} style={{ marginBottom: '10px' }} />
        <button onClick={handleUpload}>Upload & Check</button>
      </div>
    </div>
  );
  
}

export default DuplicatePage;
