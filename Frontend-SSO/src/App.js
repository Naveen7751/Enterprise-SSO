import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import PortalSelection from './Pages/PortalSelection';
import Login from './Components/Login';
import StudentPortalLogin from './Components/StudentLogin';
import StudentPortal from './Pages/StudentPortal';
import CourseLogin from './Components/CourseLogin';
import CoursePortal from './Pages/CoursePortal';

function App() {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portal-selection" element={<PortalSelection />} />
        <Route path="/login" element={<Login setToken={setToken} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/student/login" element={<StudentPortalLogin setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/student" element={<StudentPortal setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
        <Route path="/course/login" element={<CourseLogin setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/course" element={<CoursePortal setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </Router>
  );
}

export default App;
