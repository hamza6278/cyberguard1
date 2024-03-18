import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests

function Login() {
  const [full_name, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('technician');
  const navigate = useNavigate();

  const onLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3028/login', {
        full_name,
        password,
      });

      if (response.data.success) {
        // Assuming the response includes a token; adjust based on your API response
        localStorage.setItem('userToken', response.data.token); // Store the token
        localStorage.setItem('full_name', full_name); // Store full name
        localStorage.setItem('role', role); // Store role if needed for navigation or access control
        localStorage.setItem('isAuthenticated', 'true'); // Indicate that the user is authenticated
        
        navigate(`/${role}`); // Navigate based on the role
      } else {
        console.log('Login failed');
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again later.');
    }
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
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          User Name:
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
        <p>
          Don't have an account? <Link to="/register">Register now</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
