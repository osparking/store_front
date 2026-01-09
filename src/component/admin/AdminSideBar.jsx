import { BsPeopleFill, BsX } from "react-icons/bs";
import { FaChartPie } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa6";
import { GiOlive } from "react-icons/gi";
import { MdOutlineFamilyRestroom } from "react-icons/md";

const AdminSideBar = ({ openSidebar, toggleSidebar, tabClicked }) => {
  return (
    <aside id="sidebar" className={openSidebar ? "sidebar-responsive" : ""}>
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <GiOlive className="icon-header" />
          범이비누 관리
        </div>
        <span className="icon close-icon" onClick={toggleSidebar}>
          <BsX />
        </span>
      </div>
      <ul className="sidebar-list">
        <li
          className="sidebar-list-item"
          onClick={() => tabClicked("Questions")}
        >
          <a href="#">
            <FaQuestion className="icon" />
            질문<span className="smaller-amp">&</span>답변
          </a>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => tabClicked("Overview")}
        >
          <a href="#">
            <FaChartPie className="icon" />
            통계 및 차트
          </a>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => tabClicked("Employee")}
        >
          <a href="#">
            <BsPeopleFill className="icon" />
            직원 관리
          </a>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => tabClicked("Customer")}
        >
          <a href="#">
            <MdOutlineFamilyRestroom className="icon" />
            고객 관리
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSideBar;
