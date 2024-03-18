//import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imagee from "../../../images/Softwaretest1.jpg";
import React, { useContext, useEffect, useState } from 'react';

const ApproveUser = () => {
  const [newUsers, setNewUsers] = useState([]);
  const navigate = useNavigate();

  const handleViewNewUsers = () => {
    fetchNewUsers();
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

  

  const fetchNewUsers = () => {
    // Fetch data from backend API using the full URL
    fetch('http://localhost:3028/viewNewUsers')
      .then(response => response.json())
      .then(data => {
        // Update state with fetched data
        setNewUsers(data);
      })
      .catch(error => console.error('Error fetching new users:', error));
  };

  const handleRegister = (index) => {
    // Extract user details from newUsers state
    const { role, username, password } = newUsers[index];

    // Define data for the request body
    const requestData = { role, username, password };

    // Make a POST request to the backend endpoint to register the user
    fetch('http://localhost:3028/registerUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then(response => {
        if (response.ok) {
          // If registration is successful, remove the user from the newUsers state
          const updatedUsers = [...newUsers];
          updatedUsers.splice(index, 1);
          setNewUsers(updatedUsers);
          console.log('Registered user:', requestData);
        } else {
          throw new Error('Failed to register user');
        }
      })
      .catch(error => console.error('Error registering user:', error));
  };

  const handleDecline = (index) => {
    // Extract username from newUsers state
    const { username } = newUsers[index];
  
    // Make a POST request to decline the user
    fetch('http://localhost:3028/declineUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })
      .then(response => {
        if (response.ok) {
          // If decline is successful, remove the user from the newUsers state
          const updatedUsers = [...newUsers];
          updatedUsers.splice(index, 1);
          setNewUsers(updatedUsers);
          console.log('Declined user:', username);
        } else {
          throw new Error('Failed to decline user');
        }
      })
      .catch(error => console.error('Error declining user:', error));
  };

  const handleNavigate = (path) => () => {
    navigate(path);
  };

  const handleLogout = () => {
    // Clear session storage (or local storage) and redirect to login
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('full_name');
    navigate('/');
  };

  return (
    <div style={{ margin: '0px' }}>
      <div className="sidebar" style={{ width: '15%', marginTop:'-30px', backgroundColor: '#333435', padding: '35px', height: '100vh', position: 'fixed' }}>
        <div style={{ textAlign: 'center', marginTop: '0', marginBottom: '1em' }}>
          <img src={imagee} alt="Admin Dashboard" width="230" />
        </div>
        <ul className='button-container'>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '5em', height: '80vh' }}>
            {/* <button onClick={handleNavigate('/analyzer_notifications')} style={{ marginBottom: '2em' }}>Notifications</button> */}
            {/* <button onClick={handleNavigate('/analyzer/generateHash')} style={{ marginBottom: '2em' }}>Generate Hash</button> */}
            {/* <button onClick={handleNavigate('/analyzer/vtPage')} style={{ marginBottom: '2em' }}>Check Result in VT</button> */}
            <button onClick >Approve User</button>
            <button onClick={handleNavigate('/admin')}>Back to Analyzer Dashboard</button>
            <button onClick={handleLogout} style={{ width: '100%', padding: '10px', marginBottom: '2em', cursor: 'pointer' }}>Logout</button>
          </div>
        </ul>
      </div>
      <div style={{ marginLeft: '15%' }}> {/* Adjust margin-left to accommodate the sidebar width */}
        <h2 style={{ color: 'black' }}>Approve Users</h2>
        <button onClick={handleViewNewUsers} style={{ backgroundColor: '#007bff', color: 'white', marginBottom: '10px', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '120px' }}>View New Users</button>
        <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
          <thead>
            <tr style={{ background: 'white', color: 'black' }}>
              <th style={{ border: '1px solid black', padding: '12px', minWidth: '100px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Role</th>
              <th style={{ border: '1px solid black', padding: '12px', minWidth: '100px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Username</th>
              <th style={{ border: '1px solid black', padding: '12px', minWidth: '100px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Password</th>
              <th style={{ border: '1px solid black', padding: '12px', minWidth: '100px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {newUsers.map((user, index) => (
              <tr key={index} style={{ background: index === 0 ? 'white' : (index % 2 === 0 ? '#f2f2f2' : 'white') }}>
                <td style={{ border: '1px solid black', padding: '12px' }}>{user.role}</td>
                <td style={{ border: '1px solid black', padding: '12px' }}>{user.username}</td>
                <td style={{ border: '1px solid black', padding: '12px' }}>{'*'.repeat(user.password.length)}</td>
                <td style={{ border: '1px solid black', padding: '12px' }}>
                  <button onClick={() => handleRegister(index)} style={{ marginRight: '1px', marginLeft: '1px', width: '120px' }}>Register</button>
                  <button onClick={() => handleDecline(index)} style={{ marginRight: '1px', marginLeft: '1px', width: '120px' }}>Decline</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApproveUser;
