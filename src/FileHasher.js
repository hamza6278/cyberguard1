import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';

function FolderSelector() {
  const [fileData, setFileData] = useState([]);

  const handleFileRead = async (file) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const buffer = event.target.result;
      const wordArray = arrayBufferToWordArray(buffer);
      const hash = CryptoJS.SHA256(wordArray).toString(); // Using WordArray and getting the hash

      const apiKey = '57ac47c11a2b67b569acd599267de97e6af541327c588f16ffc495c11d02585f';
      const options = {
        method: 'GET',
        url: `https://www.virustotal.com/api/v3/files/${hash}`,
        headers: {
          'x-apikey': apiKey,
          accept: 'application/json',
        },
      };

      try {
        const response = await axios.request(options);
        const virusTotalResponse = response.data; // Use this response as needed

        setFileData((prevData) => [
          ...prevData,
          { fileName: file.name, directory: file.webkitRelativePath, hash, result: virusTotalResponse },
        ]);
      } catch (error) {
        console.error('Error fetching data from VirusTotal:', error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const arrayBufferToWordArray = (arrayBuffer) => {
    const words = [];
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < uint8Array.length; i += 4) {
      const word = (uint8Array[i] << 24) + (uint8Array[i + 1] << 16) + (uint8Array[i + 2] << 8) + uint8Array[i + 3];
      words.push(word);
    }
    return CryptoJS.lib.WordArray.create(words, uint8Array.length);
  };

  const onDrop = (fileList) => {
    const filesArray = Array.from(fileList); // Convert FileList object to an array

    filesArray.forEach((file) => {
      handleFileRead(file);
    });
  };

  return (
    <div>
      <div style={{ border: '1px solid black', padding: '20px', textAlign: 'center' }}>
        <input type="file" onChange={(e) => onDrop(e.target.files)} multiple />
        <p>Drag and drop some files here, or click to select files</p>
      </div>
      <table style={{ borderCollapse: 'collapse', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto' }}>
        <thead>
          <tr style={{ border: '1px solid black' }}>
            <th style={{ border: '1px solid black', padding: '8px' }}>File Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Directory</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>File Hash</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Result from VirusTotal API</th>
          </tr>
        </thead>
        <tbody>
          {fileData.map((file, index) => (
            <tr key={index} style={{ border: '1px solid black' }}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{file.fileName}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{file.directory}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{file.hash}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{JSON.stringify(file.result)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FolderSelector;
