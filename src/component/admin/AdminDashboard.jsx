import { useEffect, useState } from "react";
import { LuPanelLeftOpen } from "react-icons/lu";
import AdminSideBar from "./AdminSideBar";
import Customer from "./CustomerTable";
import Overview from "./Overview";
import ManageQuestions from "./ManageQuestions";
import WorkerTable from "./WorkerTable";

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
    setAdminTab(adminTab ? adminTab : "Questions");
  }, []);

  return (
    <main className="admin-body">
      <div className="grid-container">
        {openSidebar ? (
          <AdminSideBar
            openSidebar={openSidebar}
            toggleSidebar={toggleSidebar}
            tabClicked={tabClicked}
          />
        ) : (
          <span className="icon-header" onClick={toggleSidebar}>
            <LuPanelLeftOpen />
          </span>
        )}

        <div className="main-container">
          {adminTab === "Overview" && <Overview />}
          {adminTab === "Employee" && <WorkerTable />}
          {adminTab === "Customer" && <Customer />}
          {adminTab === "Questions" && <ManageQuestions />}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
