import React from 'react';
import {Route, Routes } from 'react-router-dom';
import {HashRouter} from 'react-router-dom';
import Start from './Start.jsx';
import MainComponent from './MainComponent.jsx';
import Final from './Final.jsx';
import './App.css';

function App() {
  const baseURL = 'https://api.render.com/deploy/srv-clu8bg0cmk4c73875pc0?key=-o7G5B1s-fI';
const xhr = new XMLHttpRequest();

// Set the CORS headers
xhr.open('GET', baseURL);
xhr.setRequestHeader('Access-Control-Allow-Origin', 'https://iovasebastian.github.io');
xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

// Send the request
xhr.onload = function() {
  if (xhr.status === 200) {
    // Handle the response
    console.log(xhr.responseText);
  } else {
    console.error('Error:', xhr.statusText);
  }
};

// Send the request
xhr.send();
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/main" element={<MainComponent />} />
          <Route path="/final" element={<Final/>}/>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;