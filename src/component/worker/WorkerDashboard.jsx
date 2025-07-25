import { useState } from "react";
import { LuPanelLeftOpen } from "react-icons/lu";
import WorkerSideBar from "./WorkerSideBar";
import StoredIngre from "./StoredIngre";

const WorkerDashboard = () => {
  const [openSidebar, setOpenSidebar] = useState(true);
  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  return (
    <main className="admin-body">
      <div className="grid-container">
        {openSidebar ? (
          <WorkerSideBar
            openSidebar={openSidebar}
            toggleSidebar={toggleSidebar}
          />
        ) : (
          <span className="icon-header" onClick={toggleSidebar}>
            <LuPanelLeftOpen />
          </span>
        )}

        <div className="main-container">
          <StoredIngre />
        </div>
      </div>
    </main>
  );
};

export default WorkerDashboard;
