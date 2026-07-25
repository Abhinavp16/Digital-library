import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/BookGridView.css'; // Create this CSS file for styling

const Book = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [departments, setDepartments] = useState([]); // State to hold department options

  useEffect(() => {
    fetchBooks();
    fetchDepartments(); // Fetch department options
  }, [searchTerm, departmentFilter]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://10.10.61.161:3000/api/books/getBooks');
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
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://10.10.61.161:3000/api/books/getDepartments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const openBookPdf = (pdfUrl) => {
    window.open(`http://10.10.61.161:3000/api/books/uploads/${pdfUrl}`, '_blank');
  };

  return (
    <div className="book-grid-container">
      <h1 id='heading'>All Uploaded Books</h1>

      <div className="container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by book name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button" onClick={() => fetchBooks()}>
            Search
          </button>
        </div>

        <div className="filter-container">
          <label htmlFor="departmentFilter">Filter by Department:</label>
          <select
            id="departmentFilter"
            name="departmentFilter"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="book-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <div className="book-image">
              <img
                src={`http://10.10.61.161:3000/api/books/uploads/${book.bookposter}`}
                alt={book.title}
              />
            </div>
            <div className="book-details">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">Author: {book.author}</p>
              <p className="book-description">Description: {book.description}</p>
            </div>
            <div className="book-actions">
              <button
                className="read-button"
                onClick={() => openBookPdf(book.bookpdf)}
              >
                Read
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Book;
