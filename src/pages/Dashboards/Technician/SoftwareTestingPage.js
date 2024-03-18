
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNotification } from '../../../context/NotificationContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './TechnicianDashboard.css';
import './SoftwareTestingPage.css';

function SoftwareTestingPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date(),
    softwareName: '',
    contact: '',
    functionality: '',
    department: '',
    letterID: '',
    remarks: '',
  });
  const [folderLocation, setFolderLocation] = useState('');
  const [fullName, setFullName] = useState('');
  const [showContactWarning, setShowContactWarning] = useState(false);

  const { addNotification } = useNotification();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const storedFullName = localStorage.getItem('full_name');

    if (!isAuthenticated) {
      navigate('/');
    } else if (storedFullName) {
      setFullName(storedFullName);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('full_name');
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'contact') {
      // Remove non-digit characters
      const cleanedValue = value.replace(/\D/g, '');

      // Limit to 11 digits
      const truncatedValue = cleanedValue.slice(0, 11);

      setFormData({
        ...formData,
        [name]: truncatedValue,
      });

      // Display a warning if the entered contact number is less than 11 digits
      setShowContactWarning(cleanedValue.length < 11);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date,
    });
  };

  const handleFolderChange = (e) => {
    const selectedFolder = e.target.files[0];
    setFolderLocation(selectedFolder ? selectedFolder.webkitRelativePath : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the contact number is 11 digits
    if (formData.contact.length !== 11) {
      toast.warning('Contact number should be 11 digits');
      return;
    }

    try {
      const response = await fetch('http://localhost:3028/submitSoftware', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, folderLocation }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Data Submitted');
        addNotification('New software submitted');

        setFormData({
          date: new Date(),
          softwareName: '',
          contact: '',
          functionality: '',
          department: '',
          letterID: '',
          remarks: '',
        });
        setFolderLocation('');
      } else {
        toast.error('Submission failed');
        setFormData({
          date: '',
          softwareName: '',
          contact: '',
          functionality: '',
          department: '',
          letterID: '',
          remarks: '',
        });
        setFolderLocation('');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    marginbottom: '0',
    cursor: 'pointer',
    height: '3em',
  };

  return (
    <div className="page-container" style={{ display: 'flex', height: '100vh' }}>
      <ToastContainer />
      <div className="sidebar" style={{ width: '15%', backgroundColor: '#333435', padding: '10px', height: '100vh' }}>
        <div style={{ textAlign: 'center', marginTop: '0px' }}>
          <img
            src="cyberguard1.jpg"
            alt="Software Test"
            width="230"
            style={{ display: 'block', margin: '0 auto', marginTop: '0', padding: '0', height: '130px' }}
          />
        </div>
        <h3 style={{ color: 'white' }}>Welcome, {fullName}!</h3>
        <Link to="/technician/SoftwareTestingPage" style={{ textDecoration: 'none', marginTop: '5em'  }}>
            <button style={buttonStyle}>Software Entry</button>
          </Link>
        <Link to="/technician" style={{ textDecoration: 'none', marginTop: '5em' }}>
          <button style={buttonStyle}>Back to Dashboard</button>
        </Link>
        <button onClick={handleLogout} style={buttonStyle}>
          Logout
        </button>
      </div>
      <div
        className="form-container"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
          width: '80%',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Upload Date:</label>
            <DatePicker selected={formData.date} onChange={handleDateChange} />
          </div>
          <div className="form-group">
            <label>Software Name:</label>
            <input type="text" name="softwareName" value={formData.softwareName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Functionality:</label>
            <input type="text" name="functionality" value={formData.functionality} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Department:</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Letter ID:</label>
            <input type="text" name="letterID" value={formData.letterID} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Contact No.:</label>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} />
            {showContactWarning && <p style={{ color: 'red' }}>Contact number should be 11 digits</p>}
          </div>
          <div className="form-group">
            <label>Remarks:</label>
            <textarea name="remarks" value={formData.remarks} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Folder Location:</label>
            <input type="file" onChange={handleFolderChange} webkitdirectory="" directory="" />
            <span>{folderLocation}</span>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default SoftwareTestingPage;