// SignInComponent.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signin.css';
const baseURL = "https://server-quizlet.vercel.app/api/items";
const Signin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const response = await axios.post(`${baseURL}/signin`, {
        username,
        password,
      });
      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('role', JSON.stringify(response.data.user.role));
        navigate('/main');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      alert('invalid');
    }
  };
  const handleSignUp = () =>{
    navigate('/signup');
  }

  return (
    <div className='center'>
      <h1>Sign in</h1>
      <input className = 'usernameSignin' type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input className = 'passwordSignin' type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button className = 'buttonSignin' onClick={handleSignIn}>Sign In</button>
      <button className = 'buttonSignin' onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default Signin;
