import { useState } from "react";
import { Container } from "react-bootstrap";
import ManageIngredient from "./ManageIngredient";
import ManageOrder from "./ManageOrder";
import "./WorkerDashboard.css";
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
    <Container fluid className="home-container worker-dashboard vw-100">
      <div className="grid-container grid-columns vw-100 mw-100 mb-3">
        <WorkerSideBar
          openSidebar={openSidebar}
          toggleSidebar={toggleSidebar}
          tabClicked={tabClicked}
        />
        <div className="main-container worker" style={{ paddingTop: 0 }}>
          {workerTab === "manageOrder" && <ManageOrder />}
          {workerTab === "manageIngredient" && <ManageIngredient />}
        </div>
      </div>
    </Container>
  );
};

export default WorkerDashboard;
