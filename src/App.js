import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Start from './Start.jsx';
import MainComponent from './MainComponent.jsx';
import Final from './Final.jsx';
import './App.css';

function App() {
  return (
    <div className="App">
      <Start/>
      
    </div>
  );
}

export default App;