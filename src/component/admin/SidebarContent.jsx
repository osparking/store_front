import "bootstrap/dist/css/bootstrap.min.css";
import { BsPeopleFill } from "react-icons/bs";
import { FaChartPie, FaQuestion } from "react-icons/fa";
import { MdOutlineFamilyRestroom } from "react-icons/md";
import "./AdminCanvas.css";
import "./SidebarContent.css";
import { GiOlive } from "react-icons/gi";

const SidebarContent = ({ tabClicked }) => (
  <div className="sidebar-content">
    <div className="sidebar-title" >
      <div className="sidebar-brand">
        <GiOlive className="icon-header" />
        관리자
      </div>
    </div>
    <ul className="sidebar-list">
      <li className="sidebar-list-item" onClick={() => tabClicked("Questions")}>
        <a href="#">
          <FaQuestion className="icon" />
          질문<span className="smaller-amp">&</span>답변
        </a>
      </li>
      <li className="sidebar-list-item" onClick={() => tabClicked("Overview")}>
        <a href="#">
          <FaChartPie className="icon" />
          통계 차트
        </a>
      </li>
      <li className="sidebar-list-item" onClick={() => tabClicked("Employee")}>
        <a href="#">
          <BsPeopleFill className="icon" />
          직원 관리
        </a>
      </li>
      <li className="sidebar-list-item" onClick={() => tabClicked("Customer")}>
        <a href="#">
          <MdOutlineFamilyRestroom className="icon" />
          고객 목록
        </a>
      </li>
    </ul>
  </div>
);

export default SidebarContent;
