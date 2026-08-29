import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faBook,
  faInfoCircle,
  faFile,
  faBookOpen,
} from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';

import '../styles/HomePage.css';

// Sample data for the grid view
const gridViewData = [
  {
    imageSrc: '/images/nptel.png',
    title: 'NPTEL',
    description: 'NPTEL is a MoE-funded project by IITs and IISc to offer quality online courses in 22 disciplines.',
    link: 'https://nptel.ac.in/',
  },
  {
    imageSrc: '/images/swayam.jpeg',
    title: 'Swayam',
    description: 'SWAYAM is a government project to provide quality online education to all, especially the marginalized.',
    link: 'https://swayam.gov.in/',
  },
  {
    imageSrc: '/images/ndli.png',
    title: 'NDLI',
    description: 'NDLI is an online library with various learning services, sponsored by MoE and run by IIT Kharagpur.',
    link: 'https://ndl.iitkgp.ac.in/',
  },
];

function HomePage({ setUserRole }) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0); // Add this state
  const navigate = useNavigate();

  // Function to fetch visitor count
   // Function to fetch visitor count
   async function fetchVisitorCount() {
    try {
      const response = await fetch('/api/visitors/count'); // Replace with your server endpoint
      if (response.ok) {
        const data = await response.json();
        return data.count;
      } else {
        console.error('Failed to fetch visitor count');
        return 0;
      }
    } catch (error) {
      console.error('Error fetching visitor count:', error);
      return 0;
    }
  }

  // Fetch visitor count when the component mounts
  useEffect(() => {
    fetchVisitorCount().then((count) => {
      setVisitorCount(count);
    });
  }, []);

  // Increment the visitor count when the component mounts
  useEffect(() => {
    // Make a GET request to increment the visitor count
    fetch('/api/visitors/increment')
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to increment visitor count');
        }
      })
      .then((data) => {
        // Visitor count has been incremented, update the count state
        setVisitorCount(data.count);
      })
      .catch((error) => {
        console.error('Error incrementing visitor count:', error);
      });
  }, []);

  const handleLoginButtonClick = () => {
    setShowLoginForm(true);
  };

  const handleCancelButtonClick = () => {
    setShowLoginForm(false);
  };

  const handleUserTypeClick = (type) => {
    setUserType(type);
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      // Determine the login endpoint based on userType
      let loginEndpoint = '';

      if (userType === 'admin') {
        loginEndpoint = 'http://localhost:3000/api/adminlogin/adminLogin'; // Update with your admin login endpoint
      } else if (userType === 'teacher') {
        loginEndpoint = 'http://localhost:3000/api/teacherlogin/teacherLogin';
      } else {
        console.error('Invalid user type');
        return;
      }

      // Make a POST request to authenticate the user
      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Redirect to the appropriate dashboard based on the role returned from the server
        if (data.role === 'admin') {
          navigate('/admin/dashboard');
          setUserRole('admin'); // Set the user role
        } else if (data.role === 'teacher') {
          navigate('/teacher/dashboard');
          setUserRole('teacher'); // Set the user role
        } else {
          console.error('Unknown role:', data.role);
        }

        // Set login success message
        setLoginSuccess(true);
      } else {
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error('Error logging in', error);
    }
  };

  return (
    <div>
      {/* Primary Navigation */}
      <nav className="navbar" aria-label="Primary navigation">
        <Link to="/" className="logo" aria-label="Digital Library home">
          <img src="/images/dlimage1.png" alt="Digital Library - Disha College" />
        </Link>

        <div className="nav-links">
          <Link to="/books" className="nav-link">
            <FontAwesomeIcon icon={faBook} />
            <span>Books</span>
          </Link>
          <Link to="/contents" className="nav-link">
            <FontAwesomeIcon icon={faFile} />
            <span>Notes</span>
          </Link>
          <Link to="/about-us" className="nav-link">
            <FontAwesomeIcon icon={faInfoCircle} />
            <span>About Us</span>
          </Link>
        </div>

        <button className="nav-login" type="button" onClick={handleLoginButtonClick}>
          <FontAwesomeIcon icon={faUser} />
          <span>Login</span>
        </button>
      </nav>
      {/*Login Form*/}
      <div id="loginFormContainer" style={{ display: showLoginForm ? 'block' : 'none' }}>
        <form id="loginForm" onSubmit={handleLogin}>
          <h2>Login to E-Library</h2>
          <div className="user-type-buttons">
            <button
              className={`user-type-button ${userType === 'admin' ? 'selected' : ''}`}
              type="button"
              onClick={() => handleUserTypeClick('admin')}
            >
              Admin
            </button>
            <button
              className={`user-type-button ${userType === 'teacher' ? 'selected' : ''}`}
              type="button"
              onClick={() => handleUserTypeClick('teacher')}
            >
              Teacher
            </button>
          </div>
          {userType && <p className="selected-user-type">Selected User Type: {userType}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          <button id="cancelButton" onClick={handleCancelButtonClick}>
            Cancel
          </button>
          {loginSuccess && <p className="login-success">Login successful!</p>}
        </form>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <img src="/images/dlimage1.png" alt="Digital Library" className="hero-logo" />
          <h1 className="hero-title">Digital Library</h1>
          <p className="hero-subtitle">Disha College</p>
          <p className="hero-description">Your Gateway to Knowledge and Learning Excellence</p>
          <div className="hero-buttons">
            <Link to="/books" className="hero-btn hero-btn-primary">
              <FontAwesomeIcon icon={faBook} /> Explore Books
            </Link>
            <Link to="/contents" className="hero-btn hero-btn-secondary">
              <FontAwesomeIcon icon={faFile} /> Browse Notes
            </Link>
          </div>
        </div>
      </section>
   
      {/* Grid View */}
      <section className="u-clearfix u-section-2" id="sec-abd3">
        <div className="u-clearfix u-sheet u-sheet-1">
          <div className="u-expanded-width u-list u-list-1">
            <div className="u-repeater u-repeater-1">
              
              {gridViewData.map((item, index) => (
                <div className="u-container-style u-hover-feature u-list-item u-repeater-item u-shape-rectangle" key={index}>
                  <div className="u-container-layout u-similar-container u-valign-top">
                    <img alt="" className="u-expanded-width u-image u-image-default u-image-1" src={item.imageSrc} />
                    <h3 className="u-text u-text-default u-text-1">{item.title}</h3>
                    <p className="u-text u-text-2">{item.description}</p>
                    <a href={item.link} className="u-active-none u-border-2 u-border-hover-palette-2-base u-border-palette-2-light-1 u-btn u-button-style u-hover-none u-none u-text-body-color u-btn-1" target="_blank">Learn More</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Clean, professional site footer */}
      <footer className="clean-footer">
        <div className="clean-footer-main">
          <section>
            <h2>Digital Library</h2>
            <p>
              Your gateway to knowledge and learning resources. Explore books, notes, and
              educational material in one place.
            </p>
            <img
              className="clean-footer-brand-logo"
              src="/images/dlimage1.png"
              alt="Digital Library, Disha College"
            />
          </section>

          <section>
            <h3>Quick Links</h3>
            <ul className="clean-footer-links">
              <li><Link to="/books">Books</Link></li>
              <li><Link to="/contents">Notes</Link></li>
              <li><Link to="/about-us">About Us</Link></li>
            </ul>
          </section>

          <section>
            <h3>Contact</h3>
            <ul className="clean-footer-contact">
              <li>Disha College, Raipur (C.G.)</li>
              <li>library@dishacollege.edu</li>
              <li>+91 1234567890</li>
            </ul>
          </section>

          <section>
            <h3>Stay Connected</h3>
            <div className="clean-footer-socials">
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
            <div className="clean-footer-counter">
              <FontAwesomeIcon icon={faBookOpen} />
              <div>
                <span>Total visitors</span>
                <strong>{visitorCount.toLocaleString()}</strong>
              </div>
            </div>
          </section>
        </div>

        <div className="clean-footer-bottom">
          <p>&copy; {new Date().getFullYear()} Digital Library - Disha College. All rights reserved.</p>
          <div className="clean-footer-legal">
            <a href="/privacy-policy">Privacy Policy</a>
            <span>|</span>
            <a href="/terms-of-service">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Login Form hidden */}
      <div id="loginFormContainer" style={{ display: showLoginForm ? 'block' : 'none' }}>
  <form id="loginForm" onSubmit={handleLogin}>
    <h2>Login to E-Library</h2>
    <div className="user-type-buttons">
      <button
        className={`user-type-button ${userType === 'admin' ? 'selected' : ''}`}
        type="button"
        onClick={() => handleUserTypeClick('admin')}
      >
        Admin
      </button>
      <button
        className={`user-type-button ${userType === 'teacher' ? 'selected' : ''}`}
        type="button"
        onClick={() => handleUserTypeClick('teacher')}
      >
        Teacher
      </button>
    </div>
    {userType && <p className="selected-user-type">Selected User Type: {userType}</p>}
    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    /><br />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button type="submit">Login</button>
    <button id="cancelButton" onClick={handleCancelButtonClick}>
      Cancel
    </button>
    {loginSuccess && <p className="login-success">Login successful!</p>}
  </form>
</div>
</div>
  );
}

export default HomePage;
