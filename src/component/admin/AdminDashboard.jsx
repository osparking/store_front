import React, { useEffect, useState } from 'react'
import { LuPanelLeftOpen } from "react-icons/lu";
import Overview from './Overview';
import AdminSideBar from './AdminSideBar';
import Employee from './Employee';
import Customer from './Customer';

const AdminDashboard = () => {
  const [adminTab, setAdminTab] = useState("");
  const tabClicked = (tab) => {
    setAdminTab(tab);
  };
  const [openSidebar, setOpenSidebar] = useState(false);
  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  useEffect(() => {
    setAdminTab("Overview");
  }, []);

  return (
    <main className="admin-body">
      <div className="grid-container">
        {openSidebar
          ? <AdminSideBar
            openSidebar={openSidebar}
            toggleSidebar={toggleSidebar}
            tabClicked={tabClicked} />
          : <span className="icon-header" onClick={toggleSidebar}>
            <LuPanelLeftOpen />
          </span>
        }  

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