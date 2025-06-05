import React, { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import {useNavigate, useLocation } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("");

  const adminDash = () => {
    navigate('/admin');
  };

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("userId"));
  }, [location]);

  useEffect(()=>{
    console.log('loggedIn', loggedIn)
  },[loggedIn])

  useEffect(() => {
    const storedRole = JSON.parse(localStorage.getItem("role"));
    setRole(storedRole);
    console.log(role);
  }, [location]);

  const signOut = () => {
    localStorage.removeItem("userId");
    setMenuOpen(false);
    navigate('/');
  };

  const goToLogin = () => {
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">Quizlet App</span>
      </div>

      <ul className="navbar-links desktop-only">
        {role === "admin" && (
            <li className='nav-item' onClick={adminDash}>Admin</li>
        )}
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
