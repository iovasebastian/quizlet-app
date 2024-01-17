// SignInComponent.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const baseURL = "https://server-quizlet.onrender.com";
  const handleSignUp = async () => {
    try {
      const response = await axios.post(`${baseURL}/signup`, {
        username,
        password,
      });
      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data.username));
        localStorage.setItem('role', JSON.stringify(response.data.username.role));
        navigate('/');
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className='center'>
      <h1>Sign up</h1>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button className = 'buttonSignin' onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default SignUp;
