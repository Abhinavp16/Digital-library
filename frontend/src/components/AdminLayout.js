// AdminLayout.js
import React from 'react';
import AdminDashboard from './AdminDashboard';

function AdminLayout({ children }) {
  return (
    <div>
      <AdminDashboard />
      <div className="content">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
