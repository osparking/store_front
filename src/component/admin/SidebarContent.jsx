import "bootstrap/dist/css/bootstrap.min.css";
import { BsPeopleFill } from "react-icons/bs";
import { FaChartPie, FaQuestion } from "react-icons/fa";
import { FaWonSign } from "react-icons/fa6";
import { GiOlive } from "react-icons/gi";
import { MdOutlineFamilyRestroom } from "react-icons/md";
import "./AdminCanvas.css";
import "./SidebarContent.css";

const qaLabel = () => {
  return (
    <span>
      질문<span className="smaller-amp">&amp;</span>답변
    </span>
  );
};

const costLabel = () => {
  return (
    <span>
      가격<span className="smaller-amp">&amp;</span>비용
    </span>
  );
};

const SidebarContent = ({ tabClicked, collapsed }) => (
  <div className="sidebar-content">
    <div className="sidebar-title">
      <div className="sidebar-brand">
        <GiOlive className="icon-header" />
        {collapsed ? "" : "관리 업무"}
      </div>
    </div>
    <ul className="sidebar-list">
      <li className="sidebar-list-item">
        <button
          className="sidebar-button"
          onClick={() => tabClicked("Questions")}
        >
          <FaQuestion className="icon" />
          {collapsed ? "" : qaLabel()}
        </button>
      </li>
      <li className="sidebar-list-item">
        <button
          className="sidebar-button"
          onClick={() => tabClicked("Overview")}
        >
          <FaChartPie className="icon" />
          {collapsed ? "" : "통계 차트"}
        </button>
      </li>
      <li className="sidebar-list-item">
        <button
          className="sidebar-button"
          onClick={() => tabClicked("Employee")}
        >
          <BsPeopleFill className="icon" />
          {collapsed ? "" : "직원 관리"}
        </button>
      </li>
      <li className="sidebar-list-item">
        <button
          className="sidebar-button"
          onClick={() => tabClicked("Customer")}
        >
          <MdOutlineFamilyRestroom className="icon" />
          {collapsed ? "" : "고객 정보"}
        </button>
      </li>
      <li className="sidebar-list-item">
        <button
          className="sidebar-button"
          onClick={() => tabClicked("PriceFee")}
        >
          <FaWonSign className="icon" />
          {collapsed ? "" : costLabel()}
        </button>
      </li>
    </ul>
  </div>
);

export default SidebarContent;
