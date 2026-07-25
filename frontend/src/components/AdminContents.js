import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import '../styles/AdminContent.css';
import EditContentForm from './EditContentForm'; // Import the EditContentForm component

const AdminContent = () => {
  const [contentList, setContentList] = useState([]);
  const [formData, setFormData] = useState({
    teacherId: '',
    className: '',
    subject: '',
    category: '',
    materialType: 'notes',
    studyMaterial: null,
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editContentId, setEditContentId] = useState(null);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [teacherNameFilter, setTeacherNameFilter] = useState('');
  const [materialTypeFilter, setMaterialTypeFilter] = useState('');

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      studyMaterial: e.target.files[0],
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { teacherId, className, subject, category, materialType, studyMaterial } = formData;
    const data = new FormData();
    data.append('teacherId', teacherId);
    data.append('className', className);
    data.append('subject', subject);
    data.append('category', category);
    data.append('materialType', materialType);
    data.append('studyMaterial', studyMaterial);

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:3000/api/content/updateContent/${editContentId}`, data);
        setIsEditMode(false);
        setEditContentId(null);
      } else {
        await axios.post('http://localhost:3000/api/content/addContent', data);
      }

      fetchContent();
      clearForm();
    } catch (error) {
      console.error('Error adding/updating content:', error);
    }
  };

  const clearForm = () => {
    setFormData({
      teacherId: '',
      className: '',
      subject: '',
      category: '',
      materialType: 'notes',
      studyMaterial: null,
    });
  };

  const handleEditContentField = async (contentId, field, value) => {
    try {
      await axios.put(`http://localhost:3000/api/content/updateContentField/${contentId}`, {
        field,
        value,
      });

      fetchContent();
    } catch (error) {
      console.error('Error updating content field:', error);
    }
  };

  const handleEditContent = (id) => {
    const contentToEdit = contentList.find((content) => content.id === id);
    if (contentToEdit) {
      setIsEditMode(true);
      setEditContentId(id);
      setFormData({
        teacherId: contentToEdit.teacher_id,
        className: contentToEdit.class_name,
        subject: contentToEdit.subject,
        category: contentToEdit.category,
        materialType: contentToEdit.material_type,
        studyMaterial: null,
      });
    }
  };

  const handleDeleteContent = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/content/deleteContent/${id}`);
      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const toggleAddForm = () => {
    setIsAddFormVisible(!isAddFormVisible);
  };

  const renderStudyMaterial = (content) => {
    if (content.material_type === 'notes') {
      return (
        <div className="pdf-viewer">
          <a
            href={`http://localhost:3000/api/content/getPdf/${content.study_material}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View PDF
          </a>
        </div>
      );
    } else if (content.material_type === 'videos') {
      return (
        <div className="video-viewer">
          <a
            href={`http://localhost:3000/api/content/getVideo/${content.study_material}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Video
          </a>
        </div>
      );
    } else if (content.material_type === 'ppt') {
      return (
        <div className="ppt-viewer">
          <a
            href={`http://localhost:3000/api/content/getPpt/${content.study_material}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </a>
        </div>
      );
    }
  };

  const filteredContent = contentList.filter((content) => {
    if (!teacherNameFilter && !materialTypeFilter) {
      return true;
    }
    const teacherNameMatch = !teacherNameFilter || content.teacher_name === teacherNameFilter;
    const materialTypeMatch = !materialTypeFilter || content.material_type === materialTypeFilter;
    return teacherNameMatch && materialTypeMatch;
  });

  const teacherNames = [...new Set(contentList.map((content) => content.teacher_name))];
  const materialTypes = [...new Set(contentList.map((content) => content.material_type))];

  return (
    <div className="admin-content">
      <h1>Content Page</h1>
      <div className="filter-container">
        <label htmlFor="teacherNameFilter">Filter by Teacher Name:</label>
        <select
          id="teacherNameFilter"
          name="teacherNameFilter"
          value={teacherNameFilter}
          onChange={(e) => setTeacherNameFilter(e.target.value)}
        >
          <option value="">All Teachers</option>
          {teacherNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <label htmlFor="materialTypeFilter">Filter by Material Type:</label>
        <select
          id="materialTypeFilter"
          name="materialTypeFilter"
          value={materialTypeFilter}
          onChange={(e) => setMaterialTypeFilter(e.target.value)}
        >
          <option value="">All Material Types</option>
          {materialTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <button onClick={toggleAddForm}>
        {isAddFormVisible ? 'Close' : 'Add Content'}
      </button>
      {isAddFormVisible && (
        <form onSubmit={handleFormSubmit} encType="multipart/form-data">
          <div className="form-group">
            <input
              type="text"
              name="teacherId"
              placeholder="Teacher ID"
              value={formData.teacherId}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="className"
              placeholder="Class Name"
              value={formData.className}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <select
              name="materialType"
              value={formData.materialType}
              onChange={handleInputChange}
              required
            >
              <option value="notes">Notes</option>
              <option value="videos">Videos</option>
              <option value="ppt">PPT</option>
            </select>
          </div>
          <div className="form-group">
            <input type="file" name="studyMaterial" onChange={handleFileChange} required />
          </div>
          <button type="submit" className="btn-primary">
            {isEditMode ? 'Update' : 'Submit'}
          </button>
          </form>
      )}
      {/* Render the EditContentForm if isEditMode is true */}
      {isEditMode && editContentId && (
        <div>
          <h2>Edit Content</h2>
          <EditContentForm
            contentId={editContentId}
            onEditSuccess={() => {
              setIsEditMode(false);
              setEditContentId(null);
              fetchContent();
            }}
          />
        </div>
      )}
      <table className="content-table">
        <thead>
          <tr>
            <th>Teacher ID</th>
            <th>Teacher Name</th>
            <th>Class Name</th>
            <th>Subject</th>
            <th>Category</th>
            <th>Material Type</th>
            <th>Study Material</th>
            <th>Uploaded At</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredContent.map((content) => (
            <tr key={content.id}>
              <td>{content.teacher_id}</td>
              <td>{content.teacher_name}</td>
              <td>{content.class_name}</td>
              <td>{content.subject}</td>
              <td>{content.category}</td>
              <td>{content.material_type}</td>
              <td>{renderStudyMaterial(content)}</td>
              <td>{moment(content.uploaded_at).format('MMMM DD, YYYY HH:mm:ss')}</td>
              <td>
                <button onClick={() => handleEditContent(content.id)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDeleteContent(content.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminContent;
