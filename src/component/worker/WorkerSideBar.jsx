import { GiOlive } from "react-icons/gi";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { LuComponent } from "react-icons/lu";
import "./WorkerSideBar.css";

const WorkerSideBar = ({ tabClicked }) => {
  return (
    <div className="sidebar-content">
      <div className="sidebar-title" style={{ padding: "15px 15px 0px" }}>
        <div className="sidebar-brand">
          <GiOlive className="icon-header" />
          직원 직무
        </div>
      </div>
      <ul className="sidebar-list">
        <li
          className="sidebar-list-item"
          onClick={() => tabClicked("manageOrder")}
        >
          <button className="buttonTab">
            <HiOutlinePencilAlt className="icon" style={{ fill: "none" }} />
            주문 관리
          </button>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => tabClicked("manageIngredient")}
        >
          <button className="buttonTab">
            <LuComponent className="icon" />
            재료 입고
          </button>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => tabClicked("registerProduce")}
        >
          <button className="buttonTab">
            <HiOutlineRectangleGroup className="icon" />
            생산 등록
          </button>
        </li>
      </ul>
    </div>
  );
};

export default WorkerSideBar;
