// SignInComponent.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_BASE_URL

  const checkEmail = (email) =>{
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  const handleSignUp = async () => {
    setEmailError(false);
    if(!checkEmail(email)){
      setEmailError(true);
      return;
    }
    try {
      const response = await axios.post(`${baseURL}/signup`, {
        email,
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
        <input className = "usernameSignin" type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input className = "passwordSignin" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button className = 'buttonSignin' onClick={handleSignUp}>Sign Up</button>
        {emailError && <p className='error'>Invalid email format</p>}
      </div>
    </div>
  );
};

export default SignUp;
