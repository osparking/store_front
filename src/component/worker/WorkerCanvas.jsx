import { useState } from "react";
import { Container } from "react-bootstrap";
import ManageIngredient from "./ManageIngredient";
import ManageOrder from "./ManageOrder";
import "./WorkerCanvas.css";
import WorkerSideBar from "./WorkerSideBar";
import RegisterProduce from "./produce/RegisterProduce";

import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import {
  Button,
  Col,
  Offcanvas,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { BsPeopleFill } from "react-icons/bs";
import { FaChartPie, FaQuestion } from "react-icons/fa";
import { GiOlive } from "react-icons/gi";
import { LuPanelLeftOpen } from "react-icons/lu";
import { MdOutlineFamilyRestroom } from "react-icons/md";

const WorkerCanvas = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

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
    <Container fluid className="worker-body">
      <Row className="admin-main g-0">
        {/* Sidebar for wide screens */}
        <Col
          lg={2}
          className={`d-none d-lg-block border-end bg-light ${sidebarCollapsed ? "collapsed" : ""}`}
          style={{
            transition: "all 0.3s ease",
            width: sidebarCollapsed ? "60px" : "16.6667%",
            zIndex: 1000,
            backgroundColor: "#263043",
          }}
        >
          <div
            className="d-flex justify-content-end p-2"
            style={{ backgroundColor: "#263043", color: "white" }}
          >
            <Button
              variant="link"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{color: "ivory"}}
            >
              {sidebarCollapsed ? "→" : "←"}
            </Button>
          </div>
          {sidebarCollapsed ? (
            <div className="text-center mt-3">
              <ul className="sidebar-list">
                <li
                  className="sidebar-list-item"
                  onClick={() => tabClicked("Questions")}
                >
                  <a href="#">
                    <FaQuestion className="icon" />
                  </a>
                </li>
                <li
                  className="sidebar-list-item"
                  onClick={() => tabClicked("Overview")}
                >
                  <a href="#">
                    <FaChartPie className="icon" />
                  </a>
                </li>
                <li
                  className="sidebar-list-item"
                  onClick={() => tabClicked("Employee")}
                >
                  <a href="#">
                    <BsPeopleFill className="icon" />
                  </a>
                </li>
                <li
                  className="sidebar-list-item"
                  onClick={() => tabClicked("Customer")}
                >
                  <a href="#">
                    <MdOutlineFamilyRestroom className="icon" />
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <WorkerSideBar
              openSidebar={openSidebar}
              sidebarCollapsed={sidebarCollapsed}
              setSidebarCollapsed={setSidebarCollapsed}
              tabClicked={tabClicked}
            />
          )}
        </Col>
        <Col lg={10} className="p-0">
          <div className="vw-100 mw-100 mb-3">
            <div className="header">
              <div className="sideDiv">
                <OverlayTrigger overlay={<Tooltip>탭 메뉴</Tooltip>}>
                  <Button
                    variant="outline-secondary"
                    onClick={handleShowOffcanvas}
                    className="d-lg-none"
                  >
                    <LuPanelLeftOpen size={24} />
                  </Button>
                </OverlayTrigger>
              </div>
              <h4
                className="mb-0 ps-0"
                style={{ fontWeight: "bold", fontSize: "22px" }}
              >
                {
                  {
                    manageOrder: "주문 관리",
                    manageIngredient: "재료 관리",
                    registerProduce: "생산 등록",
                  }[workerTab]
                }
              </h4>
              <div className="sideDiv"></div>
            </div>
            <div className="main-container worker" style={{ paddingTop: 0 }}>
              {workerTab === "manageOrder" && <ManageOrder />}
              {workerTab === "manageIngredient" && <ManageIngredient />}
              {workerTab === "registerProduce" && <RegisterProduce />}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default WorkerCanvas;
