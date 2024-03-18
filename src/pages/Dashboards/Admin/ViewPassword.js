
import React from 'react';

const ViewPasswords = () => {
  // Dummy data for demonstration
  const userData = [
    { username: 'Tech1', password: 'Password1' },
    { username: 'Tech2', password: 'Password2' },
    { username: 'Analyzer1', password: 'Password3' },
    { username: 'Analyzer2', password: 'Password4' },
    { username: 'Supervisor1', password: 'Password5' },
    { username: 'Supoervisor2', password: 'Password6' },
    { username: 'Tech3', password: 'Password7' },
    { username: 'Tech4', password: 'Password8' },
    // Add more data as needed
  ];

  return (
    <div>
      <h2>Users List</h2>
      <table style={{ borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Username</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Password</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{user.username}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{user.password}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewPasswords;