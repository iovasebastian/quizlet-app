import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { FiMenu, FiX } from "react-icons/fi";
import {useNavigate, useLocation, Link } from "react-router-dom";
import "./navbar.css";
const baseURL = process.env.REACT_APP_BASE_URL
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
    navigate('/signin');
  };

  const goToLogin = () => {
    navigate('/signin');
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
  const navigateProfile = () =>{
    navigate('/profile')
  }
  const navigateHomepage = () =>{
    navigate('/')
  }

  const getRole = async () =>{
    try{
      const response = await axios.get(`${baseURL}/getRole`,
      { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.role;
    }catch(error){
      console.error(error);
      navigate('/signin');
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          Quiz-Ez
        </Link>
      </div>

      <ul className="navbar-links desktop-only">
        {token && <li className='nav-item'><Link to="/">Homepage</Link></li>}
        {role === "admin" && (
          <li className='nav-item'><Link to="/admin">Admin</Link></li>
        )}
        {token && <li className='nav-item'><Link to="/sets">Question Sets</Link></li>}
        {token && <li className='nav-item'><Link to="/stats">Stats</Link></li>}
        {token && <li className='nav-item'><Link to="/marketplace">Marketplace</Link></li>}
        {token && <li className='nav-item'><Link to="/profile">Profile</Link></li>}
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
            {token && <li className='nav-item'><Link to="/" onClick={() => setMenuOpen(false)}>Homepage</Link></li>}
            {role === "admin" && <li className='nav-item'><Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link></li>}
            {token && <li className='nav-item'><Link to="/sets" onClick={() => setMenuOpen(false)}>Question Sets</Link></li>}
            {token && <li className='nav-item'><Link to="/stats" onClick={() => setMenuOpen(false)}>Stats</Link></li>}
            {token && <li className='nav-item'><Link to="/marketplace" onClick={() => setMenuOpen(false)}>Marketplace</Link></li>}
            {token && <li className='nav-item'><Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link></li>}
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
