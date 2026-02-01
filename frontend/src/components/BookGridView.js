import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faBookOpen,
  faUser,
  faArrowRight,
  faTimes,
  faCloudDownloadAlt,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import '../styles/BookGridView.css';

const Book = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'http://10.10.61.161:3001/api/books';

  useEffect(() => {
    fetchBooks();
    fetchDepartments();
  }, [searchTerm, departmentFilter]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/getBooks`);
      let filteredBooks = response.data;

      if (searchTerm) {
        filteredBooks = filteredBooks.filter((book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (departmentFilter) {
        filteredBooks = filteredBooks.filter(
          (book) => book.department === departmentFilter
        );
      }

      setBooks(filteredBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getDepartments`);
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const openBookPdf = (pdfUrl) => {
    setSelectedPdfUrl(pdfUrl);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when PDF is open
  };

  const closeBookPdf = () => {
    setSelectedPdfUrl(null);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  return (
    <div className="book-grid-container">
      <header className="header-section">
        <h1 id='heading'>Digital Library</h1>
        <p className="sub-heading">Explore thousands of academic resources at your fingertips</p>

        <div className="visitor-counter">
          <img
            src="https://hitwebcounter.com/counter/counter.php?page=10275556&style=0007&nbdigits=5&type=page&initCount=140"
            title="Counter Widget"
            alt="Visit counter"
            border="0"
          />
        </div>
      </header>

      <div className="container">
        <div className="search-container">
          <div className="search-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search by book name, title or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <FontAwesomeIcon
                icon={faTimes}
                className="clear-search"
                onClick={() => setSearchTerm('')}
              />
            )}
          </div>
          <button className="search-button" onClick={() => fetchBooks()}>
            Find Books
          </button>
        </div>

        <div className="filter-container">
          <label htmlFor="departmentFilter">
            <FontAwesomeIcon icon={faFilter} /> Department
          </label>
          <select
            id="departmentFilter"
            name="departmentFilter"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Academic Departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Curating your bookshelf...</p>
        </div>
      ) : (
        <div className="book-grid">
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-image">
                  <img
                    src={`${API_BASE_URL}/uploads/${book.bookposter}`}
                    alt={book.title}
                  />
                  <div className="card-overlay">
                    <button className="quick-read" onClick={() => openBookPdf(book.bookpdf)}>
                      <FontAwesomeIcon icon={faBookOpen} /> Quick Read
                    </button>
                  </div>
                </div>
                <div className="book-details">
                  <div className="department-tag">{book.department}</div>
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">
                    <FontAwesomeIcon icon={faUser} /> {book.author}
                  </p>
                  <p className="book-description">{book.description}</p>
                </div>
                <div className="book-actions">
                  <button
                    className="read-button"
                    onClick={() => openBookPdf(book.bookpdf)}
                  >
                    <span>Read Now</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <FontAwesomeIcon icon={faBookOpen} size="3x" />
              <h3>No books found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      )}

      {/* interpretation of "make more request" - adding a request book CTA */}
      <div className="request-book-footer">
        <div className="request-content">
          <h3>Can't find what you're looking for?</h3>
          <p>Submit a request and we'll try to add it to our collection.</p>
          <button className="request-btn">
            <FontAwesomeIcon icon={faPaperPlane} /> Request a Book
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      {selectedPdfUrl && (
        <div className="pdf-viewer">
          <button className="close-pdf-button" onClick={closeBookPdf}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <div className="pdf-container">
            <iframe
              title="Book PDF Viewer"
              src={`${API_BASE_URL}/uploads/${selectedPdfUrl}`}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Book;
