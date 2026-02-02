import React from 'react';
import StudentDashboard from './StudentDashboard';

function StudentLayout({ children, handleSignOut }) {
    return (
        <div className="layout-container">
            <StudentDashboard handleSignOut={handleSignOut} />
            <div className="main-content">
                {children}
            </div>
        </div>
    );
}

export default StudentLayout;
