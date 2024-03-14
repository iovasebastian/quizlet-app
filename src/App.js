import React from 'react';
import {Route, Routes } from 'react-router-dom';
import {HashRouter} from 'react-router-dom';
import Start from './Start.jsx';
import MainComponent from './MainComponent.jsx';
import Final from './Final.jsx';
import './App.css';
import Signin from './Signin.jsx';
import Admin from './Admin.jsx';
import SignUp from './SignUp.jsx';
import QuestionSets from './QuestionSets.jsx';

function App() {

  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/main" element={<MainComponent />} />
          <Route path="/final" element={<Final/>}/>
          <Route path="/admin" element ={<Admin/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/sets" element={<QuestionSets/>}/>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;