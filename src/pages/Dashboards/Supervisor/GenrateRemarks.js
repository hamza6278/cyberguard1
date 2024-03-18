import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import imagee from "../../../images/Softwaretest1.jpg";

const GenerateRemarksPage = () => {
  const [softwareResults, setSoftwareResults] = useState([]);
  const [remarksMap, setRemarksMap] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3028/fetchSoftwareResults');
      setSoftwareResults(response.data);

      // Initialize remarks map with unique folder names
      const uniqueFolderNames = Array.from(new Set(response.data.map((result) => result.folderName)));
      const initialRemarksMap = {};
      uniqueFolderNames.forEach((folderName) => {
        initialRemarksMap[folderName] = '';
      });
      setRemarksMap(initialRemarksMap);
    } catch (error) {
      console.error('Error fetching software results:', error);
    } finally {
      setLoading(false);
    }
  };

  const transformValue = (value) => {
    if (value === '{"status":404}') {
      return 'Not found in VT';
    } else if (value === '404') {
      return 'Not available';
    }

    try {
      const resultObj = JSON.parse(value);
      const lastAnalysisResults = resultObj.data.attributes.last_analysis_results;

      const detectedEngines = Object.entries(lastAnalysisResults)
        .filter(([_, result]) => result.result)
        .map(([engine]) => engine);

      const undetectedEngines = Object.entries(lastAnalysisResults)
        .filter(([_, result]) => !result.result)
        .map(([engine]) => engine);

      return { detectedEngines, undetectedEngines };
    } catch (error) {
      console.error('Error extracting engine results:', error);
      return { detectedEngines: [], undetectedEngines: [] };
    }
  };

  const handleRemarksChange = (folderName, event) => {
    const updatedRemarksMap = { ...remarksMap, [folderName]: event.target.value };
    setRemarksMap(updatedRemarksMap);
  };

  const handleSaveRemarks = async () => {
    try {
      // Create an array of objects with all columns
      const remarksData = softwareResults.map((result) => ({
        folderName: result.folderName,
        fileName: result.fileName,
        directory: result.directory,
        hash: result.hash,
        analysisResult: result.analysisResult,
        status: result.status,
        remarks: remarksMap[result.folderName] || '',
      }));

      // Send the remarks data to the server
      await axios.post('http://localhost:3028/saveRemarks', { remarksData });

      // You can handle success or show a notification to the user here
    } catch (error) {
      console.error('Error saving remarks:', error);
    }
  };

  const handleBackToDashboardClick = () => {
    navigate('/supervisor');  // Relative path to AnalyzerDashboard.js
  };

  const handleLogout = () => {
    // Clear session storage (or local storage) and redirect to login
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
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
            <button style={{ marginBottom: '2em' }}>GenrateRemarks</button>
            <button onClick={()=>navigate("/supervisor_notifications")} style={{ marginBottom: '2em' }}>Notifications</button>
            <button onClick={handleBackToDashboardClick}>Back to Dashboard</button>
            <button onClick={handleLogout} style={{ width: '100%', padding: '10px', marginBottom: '2em', cursor: 'pointer' }}>Logout</button>
          </div>
        </ul>
      </div>
      <div style={{ flex: 1 }}>
        <h2 style={{ textAlign: 'center' }}>Generate Remarks Page</h2>
        <button onClick={fetchData} style={{width: '120px', marginBottom: '1em', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Fetch Results</button>
        {loading && <p>Loading...</p>}
        {softwareResults.length > 0 && (
          <table style={{ margin: 'auto' }}>
            <thead>
              <tr>
                <th>Remarks</th>
                <th>Folder Name</th>
                <th>File Name</th>
                <th>Directory</th>
                <th>Hash</th>
                <th>Analysis Result</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(remarksMap).map(([folderName, remarks], index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td style={{ verticalAlign: 'middle' }}>
                      <input
                        type="text"
                        value={remarks}
                        onChange={(event) => handleRemarksChange(folderName, event)}
                      />
                    </td>
                    <td style={{ verticalAlign: 'middle' }}>{folderName}</td>
                    <td colSpan={4}></td>
                  </tr>
                  {softwareResults
                    .filter((result) => result.folderName === folderName)
                    .map((result, fileIndex) => (
                      <tr key={fileIndex}>
                        <td></td>
                        <td></td>
                        <td>{result.fileName}</td>
                        <td>{result.directory}</td>
                        <td>{result.hash}</td>
                        <td>
                          {transformValue(result.analysisResult).detectedEngines.length > 0 && (
                            <div>
                              Detected Engines ({transformValue(result.analysisResult).detectedEngines.length}):
                              <select>
                                {transformValue(result.analysisResult).detectedEngines.map((engine) => (
                                  <option key={engine} value={engine}>
                                    {engine}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                          {transformValue(result.analysisResult).undetectedEngines.length > 0 && (
                            <div>
                              Undetected Engines ({transformValue(result.analysisResult).undetectedEngines.length}):
                              <select>
                                {transformValue(result.analysisResult).undetectedEngines.map((engine) => (
                                  <option key={engine} value={engine}>
                                    {engine}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                          {transformValue(result.analysisResult).detectedEngines.length === 0 &&
                            transformValue(result.analysisResult).undetectedEngines.length === 0 && (
                              <p>Not found in VT</p>
                            )}
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
        <button onClick={handleSaveRemarks} style={{ width: '120px', marginBottom: '1em', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Save Remarks</button>

      </div>
    </div>
  );
};

export default GenerateRemarksPage;
