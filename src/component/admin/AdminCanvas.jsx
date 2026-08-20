import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Offcanvas,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { BsPeopleFill } from "react-icons/bs";
import { FaChartPie, FaQuestion } from "react-icons/fa";
import { FaWonSign } from "react-icons/fa6";
import { LuPanelLeftOpen } from "react-icons/lu";
import { MdOutlineFamilyRestroom } from "react-icons/md";
import "./AdminCanvas.css";
import ManageCustomers from "./ManageCustomers";
import ManagePriceFee from "./ManagePriceFee";
import ManageQuestions from "./ManageQuestions";
import ManageWorkers from "./ManageWorkers";
import Overview from "./Overview";
import SidebarContent from "./SidebarContent";

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
      {/* Main layout */}
      <Row className="admin-main g-0">
        {/* Sidebar for wide screens */}
        <Col
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
              className="text-muted"
            >
              {sidebarCollapsed ? "→" : "←"}
            </Button>
          </div>
          <SidebarContent
            tabClicked={tabClicked}
            collapsed={sidebarCollapsed}
          />
        </Col>

        {/* Main content area */}
        <Col
          lg={sidebarCollapsed ? 10 : 10}
          className="admin-main-content"
          style={{
            transition: "all 0.3s ease",
            width: sidebarCollapsed ? "90%" : "80%",
            zIndex: 1000,
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
                  Questions: "질문 및 답변",
                  Overview: "통계 챠트",
                  Employee: "직원 관리",
                  Customer: "고객 정보",
                  PriceFee: "비누 가격 및 배송비",
                }[adminTab]
              }
            </h5>
            <div className="sideDiv"></div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm main-container-div">
            {/* 메인 컨텐츠 영역 */}
            <div className="main-container">
              {
                {
                  Questions: <ManageQuestions />,
                  Overview: <Overview />,
                  Employee: <ManageWorkers />,
                  Customer: <ManageCustomers />,
                  PriceFee: <ManagePriceFee />,
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
