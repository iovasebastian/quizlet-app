// SignInComponent.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import loadingAnimation from './Rolling-1s-200px-signin.svg';
import './signin.css';
//const baseURL = "https://server-three-taupe.vercel.app/api/items";
const baseURL = "http://localhost:3000/api/items";
const Signin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const hash = window.location.hash;
  const searchParams = new URLSearchParams(hash.split('?')[1]);
  const expired = searchParams.get('expired');
  console.log(expired);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${baseURL}/signin`, {
        username,
        password,
      });
      if (response.status === 200) {
        console.log(response);
        localStorage.setItem('token', response.data.token);
        navigate('/sets', { replace: true });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error signing in:', error);
      alert('invalid');
    }
  };
  const handleSignUp = () =>{
    navigate('/signup');
  }


  return (
    <>
    {expired && <div className="errorBox">Session expired. Please log in again.</div>}
    <div className='center'>
      <div className='glass'>
        <h1>Sign in</h1>
        <input className = 'usernameSignin' type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input className = 'passwordSignin' type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        {loading?<img src = {loadingAnimation}/>:<button className = 'buttonSignin' onClick={handleSignIn}>Sign In</button>}
        {!loading&&<button className = 'buttonSignin' onClick={handleSignUp}>Sign Up</button>}
      </div>
    </div>
    </>
  );
};

export default Signin;
