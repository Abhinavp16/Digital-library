import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import '../styles/Contents.css';

const Contents = () => {
  const [contentList, setContentList] = useState([]);
  const [filters, setFilters] = useState({
    departmentFilter: '',
    teacherNameFilter: '',
    classNameFilter: '',
    filterType: 'notes',
  });

  const fetchContent = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/content/getContentWithTeacherNames');
      setContentList(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  return (
    <div className="contents-container">
      <h1 className="heading">Content Page</h1>
      <div className="container">
        {/* Department Filter */}
        <div className="filter-dropdown">
          <label htmlFor="departmentFilter" className="filter-label">
            Department:
          </label>
          <select
            id="departmentFilter"
            name="departmentFilter"
            value={filters.departmentFilter}
            onChange={(e) => handleFilterChange('departmentFilter', e.target.value)}
            className="filter-select"
          >
            <option value="">All Departments</option>
            {Array.from(new Set(contentList.map((content) => content.department))).map(
              (department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              )
            )}
          </select>
        </div>

        {/* Teacher Name Filter */}
        <div className="filter-dropdown">
          <label htmlFor="teacherNameFilter" className="filter-label">
            Teacher Name:
          </label>
          <select
            id="teacherNameFilter"
            name="teacherNameFilter"
            value={filters.teacherNameFilter}
            onChange={(e) => handleFilterChange('teacherNameFilter', e.target.value)}
            className="filter-select"
          >
            <option value="">All Teachers</option>
            {Array.from(new Set(contentList.map((content) => content.teacher_name))).map(
              (teacherName) => (
                <option key={teacherName} value={teacherName}>
                  {teacherName}
                </option>
              )
            )}
          </select>
        </div>

        {/* Class Name Filter */}
        <div className="filter-dropdown">
          <label htmlFor="classNameFilter" className="filter-label">
            Class Name:
          </label>
          <select
            id="classNameFilter"
            name="classNameFilter"
            value={filters.classNameFilter}
            onChange={(e) => handleFilterChange('classNameFilter', e.target.value)}
            className="filter-select"
          >
            <option value="">All Classes</option>
            {Array.from(new Set(contentList.map((content) => content.class_name))).map(
              (className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              )
            )}
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-dropdown">
          <label htmlFor="CategoryFilter" className="filter-label">
            Content Type:
          </label>
          <select
            id="CategoryFilter"
            name="CategoryFilter"
            value={filters.filterType}
            onChange={(e) => handleFilterChange('filterType', e.target.value)}
            className="filter-select"
          >
            <option value="notes">Notes</option>
            <option value="videos">Videos</option>
            <option value="ppt">PPT</option>
          </select>
        </div>
      </div>

      <div className="content-grid">
        {/* Content Display (filtered) */}
        {contentList
          .filter((content) => {
            if (filters.filterType === 'notes' || filters.filterType === 'videos' || filters.filterType === 'ppt') {
              return content.material_type === filters.filterType;
            }
            return true;
          })
          .filter((content) => {
            if (filters.teacherNameFilter) {
              return content.teacher_name === filters.teacherNameFilter;
            }
            return true;
          })
          .filter((content) => {
            if (filters.classNameFilter) {
              return content.class_name === filters.classNameFilter;
            }
            return true;
          })
          .filter((content) => {
            if (filters.departmentFilter) {
              return content.department === filters.departmentFilter;
            }
            return true;
          })
          .map((content) => (
            <div key={content.id} className="content-card">
              {/* Content details */}
              <p className="content-info">Teacher Name: {content.teacher_name}</p>
              <p className="content-info">Class Name: {content.class_name}</p>
              <p className="content-info">Subject: {content.subject}</p>
              <p className="content-info">Category: {content.category}</p>
              <p className="content-info">Material Type: {content.material_type}</p>
              {content.study_material && (
                <div className="material-viewer">
                  {content.material_type === 'notes' ? (
                    <a
                      className="content-link"
                      href={`http://localhost:3000/api/content/getPdf/${content.study_material}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View PDF
                    </a>
                  ) : content.material_type === 'videos' ? (
                    <a
                      className="content-link"
                      href={`http://localhost:3000/api/content/getVideo/${content.study_material}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Video
                    </a>
                  ) : content.material_type === 'ppt' ? (
                    <a
                      className="content-link"
                      href={`http://localhost:3000/api/content/getPpt/${content.study_material}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download PPT
                    </a>
                  ) : null}
                </div>
              )}
              <p className="content-info">
                Uploaded At: {moment(content.uploaded_at).format('MMMM DD, YYYY HH:mm:ss')}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Contents;
