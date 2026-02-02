import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faFileLines,
  faUser,
  faRightFromBracket,
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import '../styles/AdminDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here if needed
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-content">
        <div className="logo-section">
          <div className="logo-icon">
            <FontAwesomeIcon icon={faGraduationCap} />
          </div>
          <div className="logo-text">Student Portal</div>
        </div>

        <nav className="nav-container">
          <ul className="nav-links">
            <li className="nav-item">
              <NavLink to="/student/books" className={({ isActive }) => isActive ? 'active' : ''}>
                <span className="icon"><FontAwesomeIcon icon={faBook} /></span>
                <span className="label">Books</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/student/contents" className={({ isActive }) => isActive ? 'active' : ''}>
                <span className="icon"><FontAwesomeIcon icon={faFileLines} /></span>
                <span className="label">Contents</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                <span className="icon"><FontAwesomeIcon icon={faUser} /></span>
                <span className="label">Profile</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="dashboard-footer">
          <button className="logout-button" onClick={handleLogout}>
            <span className="icon"><FontAwesomeIcon icon={faRightFromBracket} /></span>
            <span className="label">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

