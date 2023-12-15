import React, { useState } from 'react';

function DuplicatePage() {
  //const [file, setFile] = useState(null);
  const [enteredHash, setEnteredHash] = useState('');
  const [result, setResult] = useState('');

  const knownHashCodes = [
    'hashcode1',
    'hashcode2',
    'hashcode3',
    // Add more known hash codes here
  ];

  

  

  const handleHashCheck = () => {
    if (knownHashCodes.includes(enteredHash)) {
      setResult('Hash code matches a known software.');
    } else {
      setResult('Hash code does not match any known software.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start', // Align content at the top
      height: '100vh',
    }}>
      <h2>Software Duplication Check</h2>
      <h3>Please enter your specified Software hash for Duplicacy</h3>
      <div style={{
        border: '2px solid black',
        padding: '30px',
        borderRadius: '10px',
        textAlign: 'center',
        marginTop: '60px',
      }}>
        {/* <input type="file" onChange={handleFileChange} style={{ marginBottom: '10px' }} /> */}
        
        <div>
          <input
            type="text"
            placeholder="Enter specific hash"
            value={enteredHash}
            onChange={(e) => setEnteredHash(e.target.value)}
            style={{ marginTop: '20px' }}
          />
          <button onClick={handleHashCheck}>Check Hash</button>
        </div>
        {result && <p>{result}</p>}
      </div>
    </div>
  );
}

export default DuplicatePage;
