// SoftwareTestingPage.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';



import './TechnicianDashboard.css';
import './SoftwareTestingPage.css';

function SoftwareTestingPage() {
    const [formData, setFormData] = useState({
      date: '',
      contact: '',
      functionality: '',
      department: '',
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Form Data:', formData);
      // You can handle the submission of this form data here, e.g., send it to your server.
    };
  
    return (
      <div className="center-container">
        <div className="form-container">
          <h2>Software Entry</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Date:</label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Contact:</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Functionality:</label>
              <input
                type="text"
                name="functionality"
                value={formData.functionality}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Department:</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
        <Link to="/technician"><button>Back to Dashboard</button></Link>
      </div>
    );
  }

  export default SoftwareTestingPage;