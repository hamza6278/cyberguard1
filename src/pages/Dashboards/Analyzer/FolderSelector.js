import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import CryptoJS from 'crypto-js';
import axios from 'axios';

function FolderSelector() {
  const [fileData, setFileData] = useState([]);

  const handleFileRead = async (file) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const fileContent = event.target.result;
      const hash = CryptoJS.SHA1(fileContent).toString(CryptoJS.enc.Hex);

      checkMalware(hash, file.name);
    };

    reader.readAsText(file);
  };

  const checkMalware = async (hash, fileName) => {
    const options = {
      method: 'GET',
      url: `https://www.virustotal.com/api/v3/files/${hash}`,
      headers: {
        accept: 'application/json',
        'x-apikey': '57ac47c11a2b67b569acd599267de97e6af541327c588f16ffc495c11d02585f', // Replace with your actual API key
      },
    };

    try {
      const response = await axios.request(options);
      const result = response.data.data.attributes.last_analysis_stats;

      setFileData((prevData) => [
        ...prevData,
        { fileName, hash, result: result.malicious || 0 }, // Store the number of detected positives
      ]);
    } 
    catch (error) 
    {
        if (error.response.status === 404) {
          console.log('Hash not found in VirusTotal database');
          setFileData((prevData) => [
            ...prevData,
            { fileName, hash, result: 'Not Found' },
          ]);
          // Handle the 'not found' case as needed
        } else {
          console.error(error);
        }
    }
};

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      handleFileRead(file);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'application/zip',
  });

  return (
    <div>
      <div {...getRootProps()} style={{ border: '1px solid black', padding: '20px' }}>
        <input {...getInputProps()} />
        <p>Drag and drop some files here, or click to select files</p>
      </div>
      <table style={{ borderCollapse: 'collapse', marginTop: '20px' }}>
        {/* Table headers */}
        {/* Table body */}
        <thead>
        <tr>
          <th>File Name</th>
          <th>File Hash</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        {fileData.map((file, index) => (
          <tr key={index}>
            <td>{file.fileName}</td>
            <td>{file.hash}</td>
            <td>{file.result > 0 ? file.result : 'Not Found'}</td>
          </tr>
        ))}
      </tbody>

      </table>
    </div>
  );
}

export default FolderSelector;
