import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

function FileHasher() {
  const [fileHashes, setFileHashes] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    generateFileHashes(selectedFiles);
  };

  const calculateFileHash = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileData = event.target.result;
        const wordArray = CryptoJS.lib.WordArray.create(fileData);
        const hash = CryptoJS.SHA256(wordArray).toString(); // Change this for other hash types if needed
        resolve({ name: file.name, hash: hash });
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const generateFileHashes = async (files) => {
    const hashes = [];
    for (const file of files) {
      const hashObj = await calculateFileHash(file);
      hashes.push(hashObj);
    }
    setFileHashes(hashes);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} multiple />
      <div>
        {fileHashes.map((file, index) => (
          <p key={index}>
            File: {file.name} | Hash: {file.hash}
          </p>
        ))}
      </div>
    </div>
  );
}

export default FileHasher;
