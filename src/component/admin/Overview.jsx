import { useEffect, useRef, useState } from "react";
import { BsPeopleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import CardCompo from "../card/CardCompo";
import SalesChart from "../chart/SalesChart";
import SoapChart from "../chart/SoapChart";
import UserChart from "../chart/UserChart";
import WorkerChart from "../chart/WorkerChart";
import { callWithToken } from "../util/api";

const Overview = () => {
  const [userCount, setUserCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const readCounts = async () => {
      try {
        const userCount = await callWithToken("get", "/admin/user/count");
        if (userCount) {
          setUserCount(userCount.data);
        } else {
          navigate("/login");
        }
      } catch (e) {
        console.error("유저 건수 읽는 오류: ", e);
      }
    };
    readCounts();
  }, []);

  const chartRefs = useRef({});

  const scrollToChart = (chartName) => {
    chartRefs.current[chartName]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <div className="main-cards">
        <CardCompo
          label={"유저 통계"}
          count={userCount}
          IconCompo={BsPeopleFill}
          chartName={"user"}
          scrollToChart={scrollToChart}
        />
        <CardCompo label={"생산 실적"} count={0} IconCompo={BsPeopleFill} />
        <CardCompo label={"판매 실적"} count={0} IconCompo={BsPeopleFill} />
        <CardCompo
          label={"직원 현황"}
          count={employeeCount}
          IconCompo={BsPeopleFill}
          chartName={"worker"}
          scrollToChart={scrollToChart}
        />
      </div>
      <div className="charts">
        <div className="chart-container">
          <UserChart chartRefs={chartRefs} />
        </div>
        <div className="chart-container">
          <SoapChart />
        </div>
        <div className="chart-container">
          <SalesChart />
        </div>
        <div className="chart-container">
          <WorkerChart
            setEmployeeCount={setEmployeeCount}
            chartRefs={chartRefs}
          />
        </div>
      </div>
    </>
  );
};

export default Overview;
