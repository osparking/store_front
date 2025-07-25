import { BsX } from "react-icons/bs";
import { GiOlive } from "react-icons/gi";
import { LuComponent } from "react-icons/lu";

const WorkerSideBar = ({ openSidebar, toggleSidebar, tabClicked }) => {
  return (
    <aside id="sidebar" className={openSidebar ? "sidebar-responsive" : ""}>
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <GiOlive className="icon-header" />
          직원 직무
        </div>
        <span className="icon close-icon" onClick={toggleSidebar}>
          <BsX />
        </span>
      </div>
      <ul className="sidebar-list">
        <li
          className="sidebar-list-item"
          onClick={() => tabClicked("Overview")}
        >
          <a href="#">
            <LuComponent className="icon" />
            입고 재료
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default WorkerSideBar;
