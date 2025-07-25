import { useEffect, useState } from "react";
import { LuPanelLeftOpen } from "react-icons/lu";
import AdminSideBar from "../admin/AdminSideBar";
import Customer from "../admin/CustomerTable";
import Overview from "../admin/Overview";
import WorkerTable from "../admin/WorkerTable";
import WorkSideBar from "./WorkSideBar";

const WorkDashboard = () => {
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
        {openSidebar ? (
          <WorkSideBar
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
        </div>
      </div>
    </main>
  );
};

export default WorkDashboard;
