import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from './Component/register';
import Login from './Component/login';
import StudentList from './Component/StudentList';
import AddStudent from './Component/addStudent';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/addStudent" element={<AddStudent />} />
      </Routes>
    </Router>
  );
};

export default App;