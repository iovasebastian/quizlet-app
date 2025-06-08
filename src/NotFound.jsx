import React from "react";
import { useNavigate } from "react-router-dom";
import "./notfound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-background">
      <div className="notfound-container">
        <h1>404</h1>
        <p>Oops! Page not found.</p>
        <button className="notfound-button" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
