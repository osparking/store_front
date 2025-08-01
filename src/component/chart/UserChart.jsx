import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import NoDataExists from "../common/NoDataExists";
import { callWithToken } from "../util/api";

const UserChart = () => {
  const [userStat, setUserStat] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const getUserRegisterStat = async () => {
      try {
        const userRegister = await callWithToken(
          "get",
          "/admin/user/count_stat"
        );
        const userStat = await userRegister.data.data;
        if (userRegister) {
          const chartData = Object.entries(userStat).map(
            ([month, userCount]) => {
              return {
                name: month,
                노동자: userCount.노동자 || 0,
                고객: userCount.고객 || 0,
              };
            }
          );
          setUserStat(chartData);
          console.log("chartData:", chartData);
        } else {
          navigate("/login");
        }
      } catch (err) {
        setErrorMsg("유저 등록 통계 오류: ", err.message);
      }
    };
    getUserRegisterStat();
  }, []);

  return (
    <section className="mb-5">
      {userStat && userStat.length > 0 ? (
        <React.Fragment>
          <ResponsiveContainer width={"75%"} height={300}>
            <h5 className="chart-title mb-5">등록 유저 통계</h5>
            <BarChart data={userStat}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-50} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={"노동자"} fill="#8884d8" />
              <Bar dataKey={"고객"} fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </React.Fragment>
      ) : (
        <NoDataExists dataType={" (유저) 등록 자료 "} errorMessage={errorMsg} />
      )}
    </section>
  );
};

export default UserChart;
