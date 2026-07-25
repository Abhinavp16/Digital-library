// AdminLayout.js
import React from 'react';
import TeacherDashboard from './TeacherDashboard';

function TeacherLayout({ children }) {
  return (
    <div>
      <TeacherDashboard />
      <div className="content">
        {children}
      </div>
    </div>
  );
}

export default TeacherLayout;
