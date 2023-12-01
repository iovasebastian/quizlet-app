import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Start from './Start.jsx';
import MainComponent from './MainComponent.jsx';
import Final from './Final.jsx';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router basename="/quizlet-app">
        <Routes>
          <Route path={process.env.PUBLIC_URL + "/"} element={<Start />} />
          <Route path={process.env.PUBLIC_URL + "/main"} element={<MainComponent />} />
          <Route path={process.env.PUBLIC_URL + "/final"} element={<Final/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;