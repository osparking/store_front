import { useEffect, useState } from "react";
import { LuPanelLeftOpen } from "react-icons/lu";
import AdminSideBar from "./AdminSideBar";
import Customer from "./CustomerTable";
import Overview from "./Overview";
import ManageQuestions from "./ManageQuestions";
import WorkerTable from "./WorkerTable";
import { Container } from "react-bootstrap";
import "./AdminDashboard.css"

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
    <Container className="home-container admin-body">
      <div className="grid-container vw-100 mw-100"
      style={{height: "93vh"}}
      >
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

        <div className="header">
          <h5 className="chart-title mb-0 ps-0" style={{ color: "white" }}>
            {
              {
                Questions: "질문 및 답변",
                Overview: "통계 챠트",
                Employee: "직원 관리",
                Customer: "고객 목록",
              }[adminTab]
            }
          </h5>
        </div>

        <div className="main-container">
          {
            {
              Questions: <ManageQuestions />,
              Overview: <Overview />,
              Employee: <WorkerTable />,
              Customer: <Customer />,
            }[adminTab]
          }
        </div>
      </div>
    </Container>
  );
};

export default AdminDashboard;
