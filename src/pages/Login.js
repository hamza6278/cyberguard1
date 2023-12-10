import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [full_name, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('technician');
  const navigate = useNavigate();

  const onLogin = () => {
    console.log({ full_name, password });
    fetch('http://localhost:3002/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ full_name, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('Login successful');
          navigate(`/${role}`);
        } else {
          console.log('Login failed');
          alert('Invalid credentials. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div>
        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="technician">Technician</option>
            <option value="supervisor">Supervisor</option>
            <option value="analyzer">Analyzer</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Full Name:
          <input type="text" value={full_name} onChange={(e) => setFullName(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
      </div>
      <div>
        <button onClick={onLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;
