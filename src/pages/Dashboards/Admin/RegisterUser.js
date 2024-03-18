import React, { useState } from 'react';

const RegisterUser = () => {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleRegisterClick = () => {
    const newUser = { username: newUsername, password: newPassword };
    setRegisteredUsers((prevUsers) => [...prevUsers, newUser]);
    // You can add logic for registering the user here (e.g., sending data to the server)
    // For now, let's just reset the input fields
    setNewUsername('');
    setNewPassword('');
    alert('User registered successfully!');
  };

  const handleRemoveClick = (index) => {
    setRegisteredUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      updatedUsers.splice(index, 1);
      return updatedUsers;
    });
  };

  return (
    <div>
      <h2>Register User</h2>
      <table style={{ borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Username</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Password</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Register</th>
          </tr>
        </thead>
        <tbody>
          {registeredUsers.map((user, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{user.username}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{user.password}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                <button onClick={() => handleRemoveClick(index)} style={{ backgroundColor: 'red', color: 'white' }}>Remove</button>
              </td>
            </tr>
          ))}
          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <button onClick={handleRegisterClick} style={{ backgroundColor: 'green', color: 'white' }}>Register</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RegisterUser;
