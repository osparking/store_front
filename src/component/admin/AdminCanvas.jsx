import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Offcanvas,
  OverlayTrigger,
  Row,
  Tooltip
} from "react-bootstrap";
import { BsPeopleFill } from "react-icons/bs";
import { FaChartPie, FaQuestion } from "react-icons/fa";
import { GiOlive } from "react-icons/gi";
import { LuPanelLeftOpen } from "react-icons/lu";
import { MdOutlineFamilyRestroom } from "react-icons/md";
import "./AdminCanvas.css";
import Customer from "./CustomerTable";
import ManageQuestions from "./ManageQuestions";
import Overview from "./Overview";
import SidebarContent from "./SidebarContent";
import ManageWorkers from "./ManageWorkers";

const AdminCanvas = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);
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
    <Container fluid className="admin-body">
      {/* Header with toggle button for mobile */}
      {/* 헤더 (측면바 개방 버튼 포함) */}
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
        <h3 className="mb-0 ps-0" style={{ fontWeight: "bold", fontSize: "22px"  }}>
          <GiOlive className="icon-header" />
          관리자
        </h3>
        <div className="sideDiv"></div>
      </div>
      {/* <div
        className="bg-light p-3 mb-3 border-bottom"
        style={{ backgroundColor: "#e4e6e8" }}
      >
        <OverlayTrigger overlay={<Tooltip>측면바</Tooltip>}>
          <Button
            variant="outline-secondary"
            onClick={handleShowOffcanvas}
            className="d-lg-none"
          >
            <LuPanelLeftOpen size={24} />
          </Button>
        </OverlayTrigger>
        <h2 className="d-inline-block ms-3">관리자 대시보드</h2>
      </div> */}

      {/* Main layout */}
      <Row className="admin-main g-0">
        {/* Sidebar for wide screens */}
        <Col
          lg={2}
          className={`d-none d-lg-block border-end bg-light ${sidebarCollapsed ? "collapsed" : ""}`}
          style={{
            transition: "all 0.3s ease",
            width: sidebarCollapsed ? "60px" : "16.6667%",
            zIndex: 1000,
            backgroundColor: "ivory",
          }}
        >
          <div className="d-flex justify-content-end p-2">
            <Button
              variant="link"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-muted"
            >
              {sidebarCollapsed ? "→" : "←"}
            </Button>
          </div>
          {!sidebarCollapsed ? (
            <SidebarContent tabClicked={tabClicked} />
          ) : (
            <div className="text-center mt-3" >
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
          )}
        </Col>

        {/* Main content area */}
        <Col
          lg={sidebarCollapsed ? 10 : 10}
          className="admin-main-content"
          style={{
            transition: "all 0.3s ease",
            width: sidebarCollapsed ? "90%" : "83.3333%",
            zIndex: 1000,
          }}
        >
          <h5 className="chart-title mb-4 ps-0" style={{ color: "white" }}>
            {
              {
                Questions: "질문 및 답변",
                Overview: "통계 챠트",
                Employee: "직원 관리",
                Customer: "고객 목록",
              }[adminTab]
            }
          </h5>
          <div className="bg-white p-4 rounded shadow-sm main-container-div">
            {/* 메인 컨텐츠 영역 */}
            <div className="main-container">
              {
                {
                  Questions: <ManageQuestions />,
                  Overview: <Overview />,
                  Employee: <ManageWorkers />,
                  Customer: <Customer />,
                }[adminTab]
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
          <SidebarContent tabClicked={tabClicked} />
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default AdminCanvas;
