import React, { useState } from 'react';
import axios from 'axios';

const AddApi = () => {
  const [apiKeys, setApiKeys] = useState(new Array(10).fill(''));

  const handleApiKeyChange = (index, value) => {
    const updatedApiKeys = [...apiKeys];
    updatedApiKeys[index] = value;
    setApiKeys(updatedApiKeys);
  };

  const handleAddApiClick = async () => {
    if (apiKeys.every((apiKey) => apiKey.trim() !== '')) {
      try {
        await axios.post('http://localhost:3028/saveApiKeys', { apiKeys });
        alert('API Keys saved successfully!');
      } catch (error) {
        console.error('Error saving API Keys:', error);
        alert('Error saving API Keys. Please try again.');
      }
    } else {
      alert('Please fill in all API key fields.');
    }
  };

  return (
    <div>
      <h2>Add API Keys</h2>
      <p>Enter 10 API keys:</p>

      {apiKeys.map((apiKey, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <label>{`API Key ${index + 1}: `}</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => handleApiKeyChange(index, e.target.value)}
          />
        </div>
      ))}

      <button onClick={handleAddApiClick}>Add API Keys</button>
    </div>
  );
};

export default AddApi;
