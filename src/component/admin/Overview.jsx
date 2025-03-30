import React, { useEffect, useState } from 'react'
import CardCompo from '../card/CardCompo';
import UserChart from '../chart/UserChart';
import WorkerChart from '../chart/WorkerChart';
import SalesChart from '../chart/SalesChart';
import SoapChart from '../chart/SoapChart';
import { getUserCount } from '../user/UserService';
import { useNavigate } from 'react-router-dom';

const Overview = () => {
    const [userCount, setUserCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const readCounts = async () => {
            try {
                const userCount = await getUserCount();
                if (userCount) {
                    setUserCount(userCount);
                } else {
                    navigate("/login");
                }
            } catch (e) {
                console.error("유저 건수 읽는 오류: ", e);
            }
        };
        readCounts();
    }, []);

    return (
        <main>
            <h5 className="chart-title">요약 정보</h5>
            <div className="main-cards">
                <CardCompo label={"유저 통계"} count={userCount}/>
                <CardCompo label={"생산 실적"}/>
                <CardCompo label={"판매 실적"}/>
                <CardCompo label={"직원 현황"}/>
            </div>
            <div className="charts">
                <div className="chart-container">
                    <UserChart />
                </div>
                <div className="chart-container">
                    <SoapChart />
                </div>
                <div className="chart-container">
                    <SalesChart />
                </div>
                <div className="chart-container">
                    <WorkerChart />
                </div>
            </div>
        </main>
    );
}

export default Overview