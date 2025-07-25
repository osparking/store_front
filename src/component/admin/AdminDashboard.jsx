import React, { useEffect, useState } from 'react'
import { LuPanelLeftOpen } from "react-icons/lu";
import Overview from './Overview';
import AdminSideBar from './AdminSideBar';
import WorkerTable from './WorkerTable';
import Customer from './CustomerTable';

const AdminDashboard = () => {
  const [adminTab, setAdminTab] = useState("");
  const tabClicked = (tab) => {
    setAdminTab(tab);
    localStorage.setItem("ADMIN_TAB", tab);
  };
  const [openSidebar, setOpenSidebar] = useState(true);
  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  useEffect(() => {
    const adminTab = localStorage.getItem("ADMIN_TAB");
    setAdminTab(adminTab ? adminTab : "Overview");
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
          {adminTab === "Employee" && <WorkerTable />}
          {adminTab === "Customer" && <Customer />}
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard