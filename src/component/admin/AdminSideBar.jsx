import React from 'react'
import { FaChartPie } from "react-icons/fa";
import { GiOlive } from 'react-icons/gi';

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
                <li className="sidebar-list-item">직원 관리</li>
                <li className="sidebar-list-item">고객 관리</li>

            </ul>
        </aside>
    );
}

export default AdminSideBar