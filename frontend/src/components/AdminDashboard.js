import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/AdminDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faNoteSticky,
  faBookOpen,
  faGraduationCap,
  faChalkboardUser,
  faRightFromBracket,
  faShieldHalved,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = ({ handleSignOut }) => {
  const navigate = useNavigate();

  const handleSignOutButton = () => {
    handleSignOut();
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-content">
        <div className="logo-section">
          <div className="logo-icon">
            <FontAwesomeIcon icon={faShieldHalved} />
          </div>
          <div className="logo-text">Admin Panel</div>
        </div>

        <nav className="nav-container">
          <ul className="nav-links">
            <li className="nav-item">
              <NavLink to="/admin/teachers" className={({ isActive }) => isActive ? 'active' : ''}>
                <span className="icon"><FontAwesomeIcon icon={faChalkboardUser} /></span>
                <span className="label">Teachers</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/students" className={({ isActive }) => isActive ? 'active' : ''}>
                <span className="icon"><FontAwesomeIcon icon={faGraduationCap} /></span>
                <span className="label">Students</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/books" className={({ isActive }) => isActive ? 'active' : ''}>
                <span className="icon"><FontAwesomeIcon icon={faBookOpen} /></span>
                <span className="label">Books</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/contents" className={({ isActive }) => isActive ? 'active' : ''}>
                <span className="icon"><FontAwesomeIcon icon={faNoteSticky} /></span>
                <span className="label">Notes</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/view" className={({ isActive }) => isActive ? 'active' : ''}>
                <span className="icon"><FontAwesomeIcon icon={faChartLine} /></span>
                <span className="label">Analytics</span>
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
          <button className="logout-button" onClick={handleSignOutButton}>
            <span className="icon"><FontAwesomeIcon icon={faRightFromBracket} /></span>
            <span className="label">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

AdminDashboard.propTypes = {
  handleSignOut: PropTypes.func.isRequired,
};

export default AdminDashboard;

