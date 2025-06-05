// SignInComponent.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const baseURL = "https://server-three-taupe.vercel.app/api/items";
  //const baseURL = "http://localhost:3000/api/items";
  const handleSignUp = async () => {
    try {
      const response = await axios.post(`${baseURL}/signup`, {
        username,
        password,
      });
      if (response.status === 200) {
        localStorage.setItem('userId', JSON.stringify(response.data.userId));
        localStorage.setItem('role', JSON.stringify(response.data.role));
        navigate('/');
      }
    } catch (error) {
      
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className='center'>
      <div className='glass'>
        <h1>Sign up</h1>
        <input className = "usernameSignin" type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input className = "passwordSignin" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button className = 'buttonSignin' onClick={handleSignUp}>Sign Up</button>
      </div>
    </div>
  );
};

export default SignUp;
