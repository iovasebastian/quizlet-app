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
import Test from './Test.jsx';
import Testresult from './Testresult.jsx';
import QuestionNumberPicker from './QuestionNumberPicker.jsx';
import Navbar from './Navbar.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import NotFound from './NotFound.jsx';
import Img2Text from './Img2Text.jsx';

function App() {

  return (
    <div className="App">
      <HashRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/main" element={<MainComponent />} />
          <Route path="/final" element={<Final/>}/>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/sets" element={<QuestionSets/>}/>
          <Route path='/test' element={<Test/>}/>
          <Route path='/testresult' element={<Testresult/>}/>
          <Route path='/numberpicker' element={<QuestionNumberPicker/>}/>
          <Route path='/img2text' element={<Img2Text/>}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;