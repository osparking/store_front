import { useState } from "react";
import { Container } from "react-bootstrap";
import ManageIngredient from "./ManageIngredient";
import ManageOrder from "./ManageOrder";
import "./WorkerCanvas.css";
import WorkerSideBar from "./WorkerSideBar";
import RegisterProduce from "./produce/RegisterProduce";

import "bootstrap/dist/css/bootstrap.min.css";
import {
  Button,
  Col,
  OverlayTrigger,
  Row,
  Tooltip
} from "react-bootstrap";
import { HiOutlinePencilSquare, HiOutlineRectangleGroup } from "react-icons/hi2";
import { LuComponent, LuPanelLeftOpen } from "react-icons/lu";
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
          md={2} lg={2}
          className={`d-none d-lg-block border-end bg-light ${sidebarCollapsed ? "collapsed" : ""}`}
          style={{
            transition: "all 0.3s ease",
            width: sidebarCollapsed ? "60px" : "16.6667%",
            zIndex: 1000,
            backgroundColor: "#263043",
            minWidth: "160px",
          }}
        >
          <div
            className="d-flex justify-content-end p-2"
            style={{ backgroundColor: "#263043", color: "white" }}
          >
            <Button
              variant="link"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{ color: "ivory", marginBottom: "6px" }}
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
                    <HiOutlinePencilSquare className="icon" />
                  </a>
                </li>
                <li
                  className="sidebar-list-item"
                  onClick={() => tabClicked("Overview")}
                >
                  <a href="#">
                    <LuComponent className="icon" />
                  </a>
                </li>
                <li
                  className="sidebar-list-item"
                  onClick={() => tabClicked("Employee")}
                >
                  <a href="#">
                    <HiOutlineRectangleGroup className="icon" />
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
