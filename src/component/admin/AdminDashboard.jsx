import React, { useEffect, useState } from 'react'
import Overview from './Overview';
import AdminSideBar from './AdminSideBar';
import Employee from './Employee';
import Customer from './Customer';

const AdminDashboard = () => {
  const [adminTab, setAdminTab] = useState("");
  const tabClicked = (tab) => {
    setAdminTab(tab);
  };

  useEffect(() => {
    setAdminTab("Overview");
  }, []);

  return (
    <main className="admin-body">
      <div className="grid-container">
        <AdminSideBar
          tabClicked={tabClicked} />

        <div className="main-container" >
          {adminTab === "Overview" && <Overview />}
          {adminTab === "Employee" && <Employee />}
          {adminTab === "Customer" && <Customer />}
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard