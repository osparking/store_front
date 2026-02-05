import { useState } from "react";
import { LuPanelLeftOpen } from "react-icons/lu";
import ManageOrder from "./ManageOrder";
import ManageIngredient from "./ManageIngredient";
import WorkerSideBar from "./WorkerSideBar";

const WorkerDashboard = () => {
  const [workerTab, setWorkerTab] = useState(
    localStorage.getItem("WORKER_TAB") || "manageOrder",
  );
  
  const tabClicked = (tab) => {
    setWorkerTab(tab);
    localStorage.setItem("WORKER_TAB", tab);
  };
  const [openSidebar, setOpenSidebar] = useState(true);
  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  return (
    <main className="admin-body">
      <div className="grid-container grid-columns">
        {openSidebar ? (
          <WorkerSideBar
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
          {workerTab === "manageOrder" && <ManageOrder />}
          {workerTab === "manageIngredient" && <ManageIngredient />}
        </div>
      </div>
    </main>
  );
};

export default WorkerDashboard;
