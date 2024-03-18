import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';

function FolderSelector() {
  const [fileData, setFileData] = useState([]);
  const [apiKeys, setApiKeys] = useState([
    '57ac47c11a2b67b569acd599267de97e6af541327c588f16ffc495c11d02585f', // First API Key
    'd99a2275d7516e3a4066ccee3638e8955326eb19614f386d4518743b4051c489', // Second API Key
  ]);
  const [currentApiKeyIndex, setCurrentApiKeyIndex] = useState(0);

  const handleFileRead = async (file) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const buffer = event.target.result;
      const wordArray = arrayBufferToWordArray(buffer);
      const hash = CryptoJS.SHA256(wordArray).toString();
      const directoryPath = file.webkitRelativePath.substring(
        0,
        file.webkitRelativePath.lastIndexOf('/')
      );

      const apiKey = apiKeys[currentApiKeyIndex]; // Use the current API key
      setCurrentApiKeyIndex((prevIndex) => (prevIndex + 1) % apiKeys.length); // Move to the next API key

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
        const virusTotalResponse = response.data;

        setFileData((prevData) => [
          ...prevData,
          {
            fileName: file.name,
            folderName: file.webkitRelativePath.split('/')[0],
            directory: directoryPath,
            hash,
            result: virusTotalResponse,
            status: 'found',
          },
        ]);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setFileData((prevData) => [
            ...prevData,
            {
              fileName: file.name,
              folderName: file.webkitRelativePath.split('/')[0],
              directory: file.webkitRelativePath,
              hash,
              result: { status: 404 },
              status: 'not found',
            },
          ]);
        } else {
          console.error('Error fetching data from VirusTotal:', error);
        }
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

  const determineFileStatus = (lastAnalysisResults) => {
    const detectedEngines = Object.entries(lastAnalysisResults)
      .filter(([_, result]) => result.category === 'malicious')
      .map(([engine]) => engine);

    if (detectedEngines.length > 0) {
      return {
        status: 'Malware',
        detectedEngines: detectedEngines.join(', '),
      };
    } else {
      return { status: 'Not a Malware' };
    }
  };

  const renderDetectedDropdown = (lastAnalysisResults, index) => {
    if (!lastAnalysisResults || !lastAnalysisResults.data || !lastAnalysisResults.data.attributes || !lastAnalysisResults.data.attributes.last_analysis_results) {
      return <option>No analysis result available</option>;
    }

    const { last_analysis_results } = lastAnalysisResults.data.attributes;

    if (!last_analysis_results) {
      return <option>No analysis result available</option>;
    }

    const detectedEngines = Object.entries(last_analysis_results)
      .filter(([_, result]) => result.category === 'malicious')
      .map(([engine]) => engine);

    return (
      <div style={{ display: 'inline-block', marginRight: '10px' }} key={index}>
        {detectedEngines.length > 0 ? (
          <option>{detectedEngines.length} Detected</option>
        ) : (
          <option>No detected engines</option>
        )}
        {detectedEngines.map((engine) => (
          <option key={engine} value={`${engine}`}>
            {`${engine}`}
          </option>
        ))}
      </div>
    );
  };

  const renderUndetectedDropdown = (lastAnalysisResults, index) => {
    if (!lastAnalysisResults || !lastAnalysisResults.data || !lastAnalysisResults.data.attributes || !lastAnalysisResults.data.attributes.last_analysis_results) {
      return <option>No analysis result available</option>;
    }

    const { last_analysis_results } = lastAnalysisResults.data.attributes;

    if (!last_analysis_results) {
      return <option>No analysis result available</option>;
    }

    const undetectedEngines = Object.entries(last_analysis_results)
      .filter(([_, result]) => result.category !== 'malicious')
      .map(([engine]) => engine);

    return (
      <div style={{ display: 'inline-block', marginRight: '10px' }} key={index}>
        {undetectedEngines.length > 0 ? (
          <option>{undetectedEngines.length} Undetected</option>
        ) : (
          <option>No undetected engines</option>
        )}
        {undetectedEngines.map((engine) => (
          <option key={engine} value={`${engine}`}>
            {`${engine}`}
          </option>
        ))}
      </div>
    );
  };

  const renderAnalysisResultsDropdown = (lastAnalysisResults, index) => {
    if (!lastAnalysisResults || !lastAnalysisResults.data || !lastAnalysisResults.data.attributes || !lastAnalysisResults.data.attributes.last_analysis_results) {
      return <option>No analysis result available</option>;
    }
  
    const { last_analysis_results } = lastAnalysisResults.data.attributes;
  
    if (!last_analysis_results) {
      return <option>No analysis result available</option>;
    }
  
    const detectedOptions = [];
    const undetectedOptions = [];
  
    let detectedCount = 0;
    let undetectedCount = 0;
  
    Object.entries(last_analysis_results).forEach(([engine, result]) => {
      const option = (
        <option key={engine} value={`${engine}: ${result.result ? result.result : 'Undetected'}`}>
          {`${engine}: ${result.result ? result.result : 'Undetected'}`}
        </option>
      );
  
      if (result.category === 'malicious') {
        detectedOptions.push(option);
        detectedCount++;
      } else {
        undetectedOptions.push(option);
        undetectedCount++;
      }
    });
  
    return (
      <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: '10px' }}>
          <label>Detected ({detectedCount}):</label>
          <select>{detectedOptions}</select>
        </div>
        
        <div>
          <label>Undetected ({undetectedCount}):</label>
          <select>{undetectedOptions}</select>
        </div>
      </div>
    );
  };
  const handleFileSelect = (fileList) => {
    Array.from(fileList).forEach((file) => {
      handleFileRead(file);
    });
  };

  const handleFolderSelect = (event) => {
    const folderInput = event.target;
    const files = folderInput.files;

    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        handleFileRead(file);
      });
    }
  };

  const saveToDatabase = async () => {
    try {
      const response = await axios.post('http://localhost:3028/saveDataToDB', {
        fileData: fileData,
      });
      console.log('Data saved to database:', response.data);
      setFileData([]);
    } catch (error) {
      console.error('Error saving data to database:', error);
    }
  };


  const saveHashToDatabase = async (hash) => {
    try {
      // Save the hash to the database
      await axios.post('http://localhost:3015/saveHashToDB', {
        hash: hash,
      });
      console.log('Hash saved to database:', hash);
    } catch (error) {
      console.error('Error saving hash to database:', error);
    }
  };

  const viewUnprocessedHashes = async () => {
    try {
      // Fetch hashes with null analysis results from the database
      const response = await axios.get('http://localhost:3015/getUnprocessedHashes');
      const unprocessedHashes = response.data;

      // Check their results using the VirusTotal API
      const updatedFileData = await Promise.all(
        unprocessedHashes.map(async (hash) => {
          const apiKey = apiKeys[currentApiKeyIndex]; // Use the current API key
          setCurrentApiKeyIndex((prevIndex) => (prevIndex + 1) % apiKeys.length); // Move to the next API key

          try {
            // Save the hash to the database before checking its result
            await saveHashToDatabase(hash);

            const options = {
              method: 'GET',
              url: `https://www.virustotal.com/api/v3/files/${hash}`,
              headers: {
                'x-apikey': apiKey,
                accept: 'application/json',
              },
            };

            const response = await axios.request(options);
            const virusTotalResponse = response.data;

            return {
              hash,
              result: virusTotalResponse,
            };
          } catch (error) {
            console.error(`Error checking result for hash ${hash} from VirusTotal:`, error);
            return {
              hash,
              result: null,
            };
          }
        })
      );

      // Update the fileData state with the new results
      setFileData((prevData) => [...prevData, ...updatedFileData]);
    } catch (error) {
      console.error('Error fetching unprocessed hashes:', error);
    }
  };

  return (
    <div>
      <button onClick={viewUnprocessedHashes}>View Unprocessed Hashes</button>
      <div style={{ border: '1px solid black', padding: '20px', textAlign: 'center' }}>
        <label>
          Select File(s):
          <input type="file" onChange={(e) => handleFileSelect(e.target.files)} multiple />
        </label>
        <label>
          Select Folder:
          <input type="file" onChange={handleFolderSelect} webkitdirectory="" directory="" multiple />
        </label>
        <p>Drag and drop files or folders here, or click to select</p>
      </div>
      
      <table style={{ borderCollapse: 'collapse', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto' }}>
        <thead>
          <tr style={{ border: '1px solid black' }}>
            <th style={{ border: '1px solid black', padding: '8px' }}>Folder Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>File Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Directory</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>File Hash</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Last Analysis Results</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {fileData.map((file, index) => (
            <tr key={index} style={{ border: '1px solid black' }}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{file.folderName}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{file.fileName}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{file.directory}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{file.hash}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {file.result && file.result.data && file.result.data.attributes &&
                  file.result.data.attributes.last_analysis_results ? (
                    renderAnalysisResultsDropdown(file.result, index)
                  ) : (
                    <p>No analysis result available</p>
                  )}
              </td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {file.result && file.result.status === 404 ? (
                  <span>Not found</span>
                ) : (
                  <div>
                    {determineFileStatus(
                      file.result.data.attributes.last_analysis_results
                    ).status}
                    {determineFileStatus(
                      file.result.data.attributes.last_analysis_results
                    ).detectedEngines && (
                      <p>
                        Detected by:{' '}
                        {
                          determineFileStatus(
                            file.result.data.attributes.last_analysis_results
                          ).detectedEngines
                        }
                      </p>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={saveToDatabase}>Save to DB</button>
    </div>
  );
}

export default FolderSelector; 