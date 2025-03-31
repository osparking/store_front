import React from 'react'
import { FaChartPie } from "react-icons/fa";
import { GiOlive } from 'react-icons/gi';
import { BsPeopleFill } from "react-icons/bs";
import { MdOutlineFamilyRestroom } from "react-icons/md";  

const AdminSideBar = ({ tabClicked  }) => {
    return (
        <aside id="sidebar" className="sidebar-responsive">
            <div className="sidebar-title">
                <div className='sidebar-brand'>
                    <GiOlive className="icon-header" />
                    범이비누 관리
                </div>
            </div>
            <ul className="sidebar-list">
                <li className="sidebar-list-item"
                    onClick={() => tabClicked("Overview")}
                >
                    <a href="#">
                        <FaChartPie className="icon" />
                        통계 및 차트
                    </a>
                </li>
                <li className="sidebar-list-item"
                    onClick={() => tabClicked("Employee")}
                >
                    <a href="#">
                        <BsPeopleFill className="icon" />
                        직원 관리
                    </a>
                </li>
                <li className="sidebar-list-item"
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
}

export default AdminSideBar