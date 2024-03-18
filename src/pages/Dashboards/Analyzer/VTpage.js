import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import imagee from "../../../images/Softwaretest1.jpg";

const VTPage = () => {
  const navigate = useNavigate();
  const [apiKeys, setApiKeys] = useState([]);
  const [pendingResults, setPendingResults] = useState([]);
  const [showAnalysisResult, setShowAnalysisResult] = useState(false);
  const [filesPerApiKey, setFilesPerApiKey] = useState(0);
  const [apiUsage, setApiUsage] = useState({});
  const [elapsedTime, setElapsedTime] = useState(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (!isAuthenticated) {
      navigate('/');
    } else {
      fetchApiKeys();
      fetchPendingResultsFromDB();
    }
  }, [navigate]);

  useEffect(() => {
    const usage = {};
    apiKeys.forEach((key) => {
      usage[key] = 0;
    });
    setApiUsage(usage);
  }, [apiKeys]);

  const fetchApiKeys = async () => {
    try {
      const response = await axios.get('http://localhost:3028/getApiKeys');
      setApiKeys(response.data);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    }
  };

  const fetchPendingResultsFromDB = async () => {
    try {
      const response = await axios.get('http://localhost:3028/getPendingResults');
      setPendingResults(response.data);
    } catch (error) {
      console.error('Error fetching pending results:', error);
    }
  };

  const fetchVTResults = async () => {
    try {
      const maxHashes = 5000;
      const filesToProcess = pendingResults.slice(0, maxHashes); // Take only the first 5000 results
      const filesPerKey = Math.ceil(filesToProcess.length / apiKeys.length);
      setFilesPerApiKey(filesPerKey);

      let startIdx = 0;

      const startTime = Date.now(); // Start time

      const updatedResults = await Promise.all(apiKeys.map(async (apiKey) => {
        const filesForApiKey = filesToProcess.slice(startIdx, startIdx + filesPerKey);
        startIdx += filesPerKey;

        const resultsForApiKey = await fetchResultsForApiKey(apiKey, filesForApiKey);
        setApiUsage((prevUsage) => ({ ...prevUsage, [apiKey]: prevUsage[apiKey] + filesForApiKey.length }));

        return resultsForApiKey;
      }));

      const endTime = Date.now(); // End time
      const elapsedSeconds = (endTime - startTime) / 1000; // Elapsed time in seconds
      setElapsedTime(elapsedSeconds);

      console.log(`Time taken to process all results: ${elapsedSeconds} seconds`);

      setPendingResults(updatedResults.flat());
      setShowAnalysisResult(true);
    } catch (error) {
      console.error('Error fetching VirusTotal results:', error);
    }
  };

  const fetchResultsForApiKey = async (apiKey, files) => {
    try {
      const maxFilesPerMinute = 4;
      const filesPerBatch = Math.min(maxFilesPerMinute, files.length);

      const updatedResults = [];

      for (let i = 0; i < files.length; i += filesPerBatch) {
        const batch = files.slice(i, i + filesPerBatch);
        const batchResults = await Promise.all(
          batch.map(async (result) => {
            try {
              const vtOptions = {
                method: 'GET',
                url: `https://www.virustotal.com/api/v3/files/${result.hash}`,
                headers: {
                  'x-apikey': apiKey,
                  'accept': 'application/json',
                },
              };

              const vtResponse = await axios.request(vtOptions);
              console.log(`VirusTotal Result for ${result.hash}:`, vtResponse.data);

              return { ...result, analysisResult: vtResponse.data };
            } catch (error) {
              console.error(`Error fetching VirusTotal result for ${result.hash}:`, error);
              return { ...result, analysisResult: { error: 'Error fetching result from VirusTotal' } };
            }
          })
        );

        updatedResults.push(...batchResults);

        // Sleep for a minute before processing the next batch
        if (i + filesPerBatch < files.length) {
          await new Promise((resolve) => setTimeout(resolve, 60 * 1000)); // Sleep for 1 minute
        }
      }

      return updatedResults;
    } catch (error) {
      console.error(`Error fetching results for API key ${apiKey}:`, error);
      return [];
    }
  };

  const saveToDatabase = async () => {
    try {
      await axios.post('http://localhost:3028/saveToVTDB', { results: pendingResults });
      alert('VirusTotal results saved to the database successfully!');
    } catch (error) {
      console.error('Error saving VirusTotal results to the database:', error);
      alert('Error saving VirusTotal results to the database');
    }
  };

  const renderAnalysisResultColumn = (result) => {
    if (showAnalysisResult) {
      if (result.analysisResult && !result.analysisResult.error) {
        const lastAnalysisResults = result.analysisResult.data.attributes.last_analysis_results;
        const detectedEngines = Object.entries(lastAnalysisResults)
          .filter(([_, result]) => result.category === 'malicious')
          .map(([engine]) => engine);
        const undetectedEngines = Object.entries(lastAnalysisResults)
          .filter(([_, result]) => result.category !== 'malicious')
          .map(([engine]) => engine);
        const status = detectedEngines.length > 0 ? 'Malware' : 'Not a Malware';

        return (
          <>
            <td>
              <div>
                <div style={{ float: 'left', marginRight: '10px' }}>
                  Detected Engines ({detectedEngines.length}):
                  <select>
                    {detectedEngines.map((engine) => (
                      <option key={engine} value={`${engine}`}>
                        {`${engine}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ float: 'right' }}>
                  Undetected Engines ({undetectedEngines.length}):
                  <select>
                    {undetectedEngines.map((engine) => (
                      <option key={engine} value={`${engine}`}>
                        {`${engine}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </td>
            <td>{status}</td>
          </>
        );
      } else {
        return (
          <>
            <td>Not Found in VT</td>
            <td>Not Found in VT</td>
          </>
        );
      }
    }
    return null;
  };

  const handleLogout = () => {
    // Clear session storage (or local storage) and redirect to login
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('full_name');
    navigate('/');
  };

  const handleNavigate = (path) => () => {
    navigate(path);
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <div className="sidebar" style={{ width: '15%', marginTop:'-30px', marginLeft:'0px',marginRight:'30px', backgroundColor: '#333435', padding: '35px', height: '100%', position: 'absolute' }}>
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

      {/* Main content */}
      <div style={{ marginLeft: '15%', padding: '0px',  }}>
        <h2>VirusTotal Page</h2>
        <p>Displaying pending results where remarks are null:</p>

        <table>
          <thead>
            <tr>
              <th>Serial Number</th>
              <th>File Name</th>
              <th>Folder Name</th>
              <th>Directory</th>
              <th>File Hash</th>
              {showAnalysisResult && (
                <>
                  <th>Analysis Result</th>
                  <th>Status</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {pendingResults.map((result, index) => (
              <tr key={result.id}>
                <td>{index + 1}</td>
                <td>{result.fileName}</td>
                <td>{result.folderName}</td>
                <td>{result.directory}</td>
                <td>{result.hash}</td>
                {index < 5000 ? renderAnalysisResultColumn(result) : <><td></td><td></td></>} {/* Empty columns for results beyond 5000 */}
              </tr>
            ))}
          </tbody>
        </table>

        <p>Time taken to show all results: {elapsedTime !== null ? `${elapsedTime} seconds` : 'Not calculated'}</p>

        <button onClick={fetchVTResults} style={{ width: '150px' }}>Show VT Result</button>
        <button onClick={saveToDatabase} style={{ width: '150px' }}>Save Results</button>

        {/* Button to save results to the database */}

        <div>
          <p>API Keys used for fetching results:</p>
          <ul>
            {apiKeys.map((key, index) => (
              <li key={index}>{key} (Usage: {apiUsage[key] || 0})</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VTPage;
