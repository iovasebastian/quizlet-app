import React from 'react';
import {Route, Routes } from 'react-router-dom';
import {HashRouter} from 'react-router-dom';
import MainComponent from './components/MainComponent/MainComponent.jsx';
import Final from './components/Final/Final.jsx';
import './App.css';
import Signin from './components/SignIn/Signin.jsx';
import Admin from './components/Admin/Admin.jsx';
import SignUp from './components/SignUp/SignUp.jsx';
import QuestionSets from './components/QuestionSets/QuestionSets.jsx';
import Test from './components/TestComp/Test.jsx';
import Testresult from './components/TestResult/Testresult.jsx';
import QuestionNumberPicker from './components/QuestionNumberPicker/QuestionNumberPicker.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import NotFound from './components/Notfound/NotFound.jsx';
import Img2Text from './components/Img2Text/Img2Text.jsx';
import ForgotPassword from './components/ForgotPassword/ForgotPassword.jsx';
import ForgotPasswordStep2 from './components/ForgotPassword/ForgotPasswordStep2.jsx';
import Stats from './components/Stats/Stats.jsx';
import Marketplace from './components/Marketplace/Marketplace.jsx';

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
          <Route path='/forgotPassword' element={<ForgotPassword/>}/>
          <Route path='/forgotPasswordStep2' element={<ForgotPasswordStep2/>}/>
          <Route path='/stats' element={<Stats/>}/>
          <Route path='/marketplace' element={<Marketplace/>}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;