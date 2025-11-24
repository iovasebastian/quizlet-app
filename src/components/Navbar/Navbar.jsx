import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { FiMenu, FiX } from "react-icons/fi";
import {useNavigate, useLocation } from "react-router-dom";
import "./navbar.css";
const baseURL = "https://server-three-taupe.vercel.app/api/items";
//const baseURL = "http://localhost:3000/api/items";
const token = localStorage.getItem("token");

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("");
  const token = localStorage.getItem("token");

  const adminDash = () => {
    navigate('/admin');
  };

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, [location]);

  useEffect(() => {
    if(token){
      console.log('getRole', token)
      const fetchRole = async () => {
        const fetchedRole = await getRole();
        setRole(fetchedRole);
      };
      fetchRole();
    }
  }, [location, loggedIn]);

  const signOut = () => {
    localStorage.removeItem("token");
    setMenuOpen(false);
    setRole("");
    navigate('/');
  };

  const goToLogin = () => {
    navigate('/');
  };

  const navigateQuestionSet = () =>{
    navigate('/sets')
  }

  const navigateStats = () =>{
    navigate('/stats')
  }

  const navigateMarketplace = () =>{
    navigate('/marketplace')
  }

  const getRole = async () =>{
    try{
      const response = await axios.get(`${baseURL}/getRole`,
      { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.role;
    }catch(error){
      console.error(error);
      navigate('/');
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">Quiz-Ez</span>
      </div>

      <ul className="navbar-links desktop-only">
        {role === "admin" && (
          <li className='nav-item' onClick={adminDash}>Admin</li>
        )}
        {token && <li className='nav-item' onClick={navigateQuestionSet}>Question Sets</li>}
        {token && <li className='nav-item' onClick={navigateStats}>Stats</li>}
        {token && <li className='nav-item' onClick={navigateMarketplace}>Marketplace</li>}
      </ul>

      <div className="navbar-right desktop-only">
        <button className="navbar-button" onClick={loggedIn ? signOut : goToLogin}>
          {loggedIn ? "Log Out" : "Log In"}
        </button>
      </div>

      {!menuOpen&&<div className="mobile-menu-icon" onClick={() => setMenuOpen(true)}>
        <FiMenu size={24} />
      </div>}

      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-close-icon" onClick={() => setMenuOpen(false)}>
            <FiX color="white" size={24} />
          </div>
          <ul>
            {role === "admin" && <li className='nav-item' onClick={() => {adminDash(); setMenuOpen(false);}}>Admin</li>}
            {token && <li className='nav-item' onClick={() => {navigateQuestionSet(); setMenuOpen(false)}}>Question Sets</li>}
            {token && <li className='nav-item' onClick={() => {navigateStats(); setMenuOpen(false)}}>Stats</li>}
            {token && <li className='nav-item' onClick={() => {navigateMarketplace(); setMenuOpen(false)}}>Marketplace</li>}
            <li className="nav-item" onClick={() => {setMenuOpen(false); loggedIn ? signOut() : goToLogin()}}>
              {loggedIn ? "Log Out" : "Log In"}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
