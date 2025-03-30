import React from 'react'
import CardCompo from '../card/CardCompo';
import UserChart from '../chart/UserChart';
import WorkerChart from '../chart/WorkerChart';
import SalesChart from '../chart/SalesChart';
import SoapChart from '../chart/SoapChart';

const Overview = () => {
    return (
        <main>
            <h5 className="chart-title">요약 정보</h5>
            <div className="main-cards">
                <CardCompo label={"유저 통계"}/>
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