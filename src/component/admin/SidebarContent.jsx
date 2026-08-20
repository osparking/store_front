import "bootstrap/dist/css/bootstrap.min.css";
import { BsPeopleFill } from "react-icons/bs";
import { FaChartPie, FaQuestion } from "react-icons/fa";
import { FaWonSign } from "react-icons/fa6";
import { GiOlive } from "react-icons/gi";
import { MdOutlineFamilyRestroom } from "react-icons/md";
import "./AdminCanvas.css";
import "./SidebarContent.css";

const SidebarContent = ({ tabClicked }) => (
  <div className="sidebar-content">
    <div className="sidebar-title">
      <div className="sidebar-brand">
        <GiOlive className="icon-header" />
        관리 업무
      </div>
    </div>
    <ul className="sidebar-list">
      <li className="sidebar-list-item">
        <button
          className="sidebar-button"
          onClick={() => tabClicked("Questions")}
        >
          <FaQuestion className="icon" />
          질문<span className="smaller-amp">&</span>답변
        </button>
      </li>
      <li className="sidebar-list-item">
        <button
          className="sidebar-button"
          onClick={() => tabClicked("Overview")}
        >
          <FaChartPie className="icon" />
          통계 차트
        </button>
      </li>
      <li className="sidebar-list-item">
        <button
          className="sidebar-button"
          onClick={() => tabClicked("Employee")}
        >
          <BsPeopleFill className="icon" />
          직원 관리
        </button>
      </li>
      <li className="sidebar-list-item">
        <button
          className="sidebar-button"
          onClick={() => tabClicked("Customer")}
        >
          <MdOutlineFamilyRestroom className="icon" />
          고객 정보
        </button>
      </li>
      <li className="sidebar-list-item">
        <button
          className="sidebar-button"
          onClick={() => tabClicked("PriceFee")}
        >
          <FaWonSign className="icon" />
          가격&비용
        </button>
      </li>
    </ul>
  </div>
);

export default SidebarContent;
