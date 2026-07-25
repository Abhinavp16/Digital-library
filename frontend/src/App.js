import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminTeachers from './components/AdminTeachers';
import AdminStudents from './components/AdminStudents';
import AdminBooks from './components/AdminBooks';
import AdminContents from './components/AdminContents';
import BookGridView from './components/StudentBooks';
import StudentDashboard from './components/StudentDashboard';
import StudentContent from './components/StudentContent';
import HomePage from './components/HomePage';
import AboutUsPage from './components/AboutUsPage';
import Book from './components/BookGridView';
import AdminLayout from './components/AdminLayout';
import Contents from './components/Contents';
import TeacherLayout from './components/TeacherLayout';

function App() {
  const [userRole, setUserRole] = useState(''); // Store user authentication status

  return (
    <Router>
      <div className="App">
        {/* Conditional rendering of the Sidebar based on user's authentication status */}
        {userRole === 'admin' && <AdminLayout setUserRole={setUserRole} />}
        {userRole === 'teacher' && <TeacherLayout setUserRole={setUserRole} />}
        
        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<HomePage setUserRole={setUserRole} />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/books" element={<Book />} />
          <Route path="/contents" element={<Contents />} />
          <Route path="/admin/dashboard" element={<AdminDashboard setUserRole={setUserRole} />} />
          <Route path="/admin/teachers" element={<AdminTeachers />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/books" element={<AdminBooks />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard setUserRole={setUserRole} />} />
          <Route path="/admin/contents" element={<AdminContents />} />
          <Route path="/student/books" element={<BookGridView />} />
          <Route path="/student/contents" element={<StudentContent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
