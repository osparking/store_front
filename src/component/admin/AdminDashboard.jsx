import React from 'react'
import Overview from './Overview';
import AdminSideBar from './AdminSideBar';

const AdminDashboard = () => {
  return (
    <main className="admin-body">
      <div className="grid-container">
        <AdminSideBar />
        <div className="main-container">
          <Overview />
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard