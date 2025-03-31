import React, { useState } from 'react'
import Overview from './Overview';
import AdminSideBar from './AdminSideBar';

const AdminDashboard = () => {
  const [adminTab, setAdminTab] = useState("Overview");
  const tabClicked = (tab) => {
    setAdminTab(tab);
  };

  return (
    <main className="admin-body">
      <div className="grid-container">
        <AdminSideBar
          tabClicked={tabClicked} />

        <div className="main-container" >
          {adminTab === "Overview" && <Overview />}
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard