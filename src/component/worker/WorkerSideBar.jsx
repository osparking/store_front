import { GiOlive } from "react-icons/gi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { LuComponent } from "react-icons/lu";

const WorkerSideBar = ({ openSidebar, toggleSidebar, tabClicked }) => {
  return (
    <aside
      id="sidebar"
      className={openSidebar ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
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
            재료 관리
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default WorkerSideBar;
