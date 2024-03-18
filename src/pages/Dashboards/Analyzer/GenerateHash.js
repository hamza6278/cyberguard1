import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import imagee from "../../../images/Softwaretest1.jpg";

function GenerateHash() {
  const navigate = useNavigate();
  const [fileData, setFileData] = useState([]);
  const [hashCalculatingMessage, setHashCalculatingMessage] = useState('');
  const [hashProgress, setHashProgress] = useState('');
  const [apiKeysUsage, setApiKeysUsage] = useState([]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    fetchApiKeysUsage();
  }, []);

  const fetchApiKeysUsage = async () => {
    try {
      const response = await axios.get('http://localhost:3028/getApiKeysUsage');
      setApiKeysUsage(response.data);
    } catch (error) {
      console.error('Error fetching API keys usage:', error);
    }
  };

  const handleFileRead = (file, index, totalFiles) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const buffer = event.target.result;
      const wordArray = arrayBufferToWordArray(buffer);
      const hash = CryptoJS.SHA256(wordArray).toString();
      const directoryPath = file.webkitRelativePath.substring(
        0,
        file.webkitRelativePath.lastIndexOf('/')
      );

      setFileData((prevData) => [
        ...prevData,
        {
          fileName: file.name,
          folderName: file.webkitRelativePath.split('/')[0],
          directory: directoryPath,
          hash,
        },
      ]);

      setHashProgress(`${index + 1}/${totalFiles} file hash${index === totalFiles - 1 ? 'es' : ''} calculated`);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileSelect = (event) => {
    const fileList = event.target.files;
    setHashCalculatingMessage(`Calculating hashes for ${fileList.length} files...`);
    setHashProgress('');

    Array.from(fileList).forEach((file, index) => {
      handleFileRead(file, index, fileList.length);
    });

    setHashCalculatingMessage(`All hashes of ${fileList.length} files calculated successfully.`);
  };

  const arrayBufferToWordArray = (arrayBuffer) => {
    const words = [];
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < uint8Array.length; i += 4) {
      const word =
        (uint8Array[i] << 24) +
        (uint8Array[i + 1] << 16) +
        (uint8Array[i + 2] << 8) +
        uint8Array[i + 3];
      words.push(word);
    }
    return CryptoJS.lib.WordArray.create(words, uint8Array.length);
  };

  const saveToDatabase = async () => {
    try {
      await axios.post('http://localhost:3028/saveHashResults', {
        hashResults: fileData,
      });
      setFileData([]);
      console.log('Data saved to the database successfully.');
    } catch (error) {
      console.error('Error saving data to the database:', error);
    }
  };

  const handleNavigate = (path) => () => {
    navigate(path);
  };


  const handleFolderSelect = (event) => {
    const folderInput = event.target;
    const files = folderInput.files;
  
    if (files && files.length > 0) {
      setHashCalculatingMessage(`Calculating hashes for ${files.length} files...`);
      setHashProgress(''); // Reset progress when new files are selected
  
      Array.from(files).forEach((file, index) => {
        handleFileRead(file, index, files.length);
      });
  
      setHashCalculatingMessage(`All hashes of ${files.length} files calculated successfully.`);
    }
  };

  const handleLogout = () => {
    // Clear session storage (or local storage) and redirect to login
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('full_name');
    navigate('/');
  };

  return (
    <div style={{ display: 'flex' }}>
      <div className="sidebar" style={{ width: '20%', backgroundColor: '#333435', padding: '10px', height: '100vh' }}>
        <div style={{ textAlign: 'center', marginTop: '0', marginBottom: '1em' }}>
          <img src={imagee} alt="Admin Dashboard" width="230" />
        </div>
        <ul className='button-container'>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '5em', height: '80vh' }}>
            <button onClick={handleNavigate('/analyzer_notifications')} style={{ marginBottom: '2em' }}>Notifications</button>
            <button onClick={handleNavigate('/analyzer/generateHash')} style={{ marginBottom: '2em' }}>Generate Hash</button>
            <button onClick={handleNavigate('/analyzer/vtPage')} style={{ marginBottom: '2em' }}>Check Result in VT</button>
            <button onClick={handleNavigate('/analyzer/analyzerdashboard')}>Back to Analyzer Dashboard</button>
            <button onClick={handleLogout} style={{ width: '100%', padding: '10px', marginBottom: '2em', cursor: 'pointer' }}>Logout</button>
          </div>
        </ul>
      </div>
      <div style={{ border: '1px solid black', padding: '20px', textAlign: 'center', flex: 1 }}>
        <label>
          Select File(s):
          <input type="file" onChange={handleFileSelect} multiple />
        </label>
        <label>
          Select Folder:
          <input type="file" onChange={handleFolderSelect} webkitdirectory="" directory="" multiple />
        </label>
        <p>{hashCalculatingMessage}</p>
        <p>{hashProgress}</p>
        <table style={{ borderCollapse: 'collapse', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto' }}>
          <thead>
            <tr style={{ border: '1px solid black' }}>
              <th style={{ border: '1px solid black', padding: '8px' }}>Folder Name</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>File Name</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Directory</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>File Hash</th>
            </tr>
          </thead>
          <tbody>
            {fileData.map((file, index) => (
              <tr key={index} style={{ border: '1px solid black' }}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{file.folderName}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{file.fileName}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{file.directory}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{file.hash}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={saveToDatabase}>Save to DB</button>
      </div>
    </div>
  );
}

export default GenerateHash;
