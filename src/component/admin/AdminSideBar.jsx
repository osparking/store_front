import React from 'react'

const AdminSideBar = () => {
    return (
        <aside id="sidebar" className="sidebar-responsive">
            <div className="sidebar-title">
                범이비누 관리
            </div>
            <ul className="sidebar-list">
                <li className="sidebar-list-item">통계 및 차트</li>
                <li className="sidebar-list-item">직원 관리</li>
                <li className="sidebar-list-item">고객 관리</li>
            </ul>
        </aside>
    );
}

export default AdminSideBar