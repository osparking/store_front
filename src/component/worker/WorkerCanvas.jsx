import { useState } from "react";
import { Container, Offcanvas } from "react-bootstrap";
import ManageIngredient from "./ManageIngredient";
import ManageOrder from "./ManageOrder";
import "./WorkerCanvas.css";
import WorkerSideBar from "./WorkerSideBar";
import RegisterProduce from "./produce/RegisterProduce";

import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import {
  HiOutlinePencilSquare,
  HiOutlineRectangleGroup,
} from "react-icons/hi2";
import { LuComponent, LuPanelLeftOpen } from "react-icons/lu";
import SidebarContent from "../admin/SidebarContent";

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
          md={2}
          lg={2}
          className={`d-none d-lg-block border-end bg-lightblue ${sidebarCollapsed ? "collapsed" : ""}`}
          style={{
            transition: "all 0.3s ease",
            width: sidebarCollapsed ? "60px" : "20%",
            zIndex: 1000,
          }}
        >
          <div className="d-flex justify-content-end p-2">
            <Button
              variant="link"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{ color: "navy" }}
            >
              {sidebarCollapsed ? "→" : "←"}
            </Button>
          </div>
          {sidebarCollapsed ? (
            <div className="text-center mt-3">
              <ul className="sidebar-list">
                <li
                  className="sidebar-list-item"
                  onClick={() => tabClicked("manageOrder")}
                >
                  <a href="#">
                    <HiOutlinePencilSquare className="icon" />
                  </a>
                </li>
                <li
                  className="sidebar-list-item"
                  onClick={() => tabClicked("manageIngredient")}
                >
                  <a href="#">
                    <LuComponent className="icon" />
                  </a>
                </li>
                <li
                  className="sidebar-list-item"
                  onClick={() => tabClicked("registerProduce")}
                >
                  <a href="#">
                    <HiOutlineRectangleGroup className="icon" />
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <WorkerSideBar
              tabClicked={tabClicked}
            />
          )}
        </Col>
        <Col
          lg={10}
          className="worker-main-content"
          style={{
            width: sidebarCollapsed ? "90%" : "80%",
          }}
        >
          <div
            className="header mb-3"
            style={{ backgroundColor: "#263043", color: "white" }}
          >
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
            <h5 className="chart-title ps-0" style={{ color: "white" }}>
              {
                {
                  manageOrder: "주문 관리",
                  manageIngredient: "재료 관리",
                  registerProduce: "생산 등록",
                }[workerTab]
              }
            </h5>
            <div className="sideDiv"></div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm main-container-div">
            <div className="main-container">
              {
                {
                  manageOrder: <ManageOrder />,
                  manageIngredient: <ManageIngredient />,
                  registerProduce: <RegisterProduce />,
                }[workerTab]
              }
            </div>
          </div>
        </Col>
      </Row>
      {/* Offcanvas for mobile screens */}
      <Offcanvas
        show={showOffcanvas}
        onHide={handleCloseOffcanvas}
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>탭 메뉴</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <WorkerSideBar tabClicked={tabClicked} />
        </Offcanvas.Body>
      </Offcanvas>      
    </Container>
  );
};

export default WorkerCanvas;
