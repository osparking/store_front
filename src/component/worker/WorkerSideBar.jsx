import { GiOlive } from "react-icons/gi";
import {
  HiOutlinePencilSquare,
  HiOutlineRectangleGroup,
} from "react-icons/hi2";
import { LuComponent } from "react-icons/lu";

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
          <a href="#">
            <HiOutlinePencilSquare className="icon" />
            주문 관리
          </a>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => tabClicked("manageIngredient")}
        >
          <a href="#">
            <LuComponent className="icon" />
            재료 입고
          </a>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => tabClicked("registerProduce")}
        >
          <a href="#">
            <HiOutlineRectangleGroup className="icon" />
            생산 등록
          </a>
        </li>
      </ul>
    </div>
  );
};

export default WorkerSideBar;
