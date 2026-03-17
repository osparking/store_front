import { useEffect, useState } from "react";
import { Legend, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import NoDataExists from "../common/NoDataExists";
import { callWithToken } from "../util/api";
import "./Chart.css";

const WorkerChart = ({ setEmployeeCount, chartRef }) => {
  const [employeeStat, setEmployeeStat] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const getEmployeeStat = async () => {
      try {
        const employeeDept = await callWithToken("get", "/admin/employee_dept");
        const departmentStat = await employeeDept.data.data;
        const totalPeople = departmentStat.reduce(
          (sum, dept) => sum + dept.people,
          0,
        );
        setEmployeeCount(totalPeople);
        if (departmentStat) {
          setEmployeeStat(departmentStat);
        } else {
          navigate("/login");
        }
      } catch (err) {
        setErrorMsg("직원 부서 통계 오류: ", err.message);
      }
    };
    getEmployeeStat();
  }, []);

  const colors = ["pink", "skyblue", "green", "orange", "ivory"];

  return (
    <section
      className="mb-5"
      ref={chartRef}
      style={{ scrollMarginTop: "260px" }}
    >
      {employeeStat && employeeStat.length > 0 ? (
        <>
          <h5 className="chart-title mb-3">직원 부서 통계</h5>
          <ResponsiveContainer id="adminWorkerChart" height={300}>
            <PieChart className="p-1" style={{ backgroundColor: "#0D0C24" }}>
              <Pie
                data={employeeStat}
                dataKey="people"
                nameKey="department"
                label={({ department, people }) => `${department}: ${people}`}
                outerRadius={75}
                fill="#8884d8"
                shape={(props) => {
                  const { index, ...restProps } = props;
                  return (
                    <Sector
                      {...restProps}
                      fill={colors[index % colors.length]}
                    />
                  );
                }}
              ></Pie>
              <Legend
                layout="horizontal"
                formatter={(value, entry) => {
                  const index = employeeStat.findIndex(
                    (item) => item.department === value,
                  );
                  return (
                    <span style={{ color: colors[index % colors.length] }}>
                      {value}
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </>
      ) : (
        <NoDataExists dataType={"직원"} errorMessage={errorMsg} />
      )}
    </section>
  );
};

export default WorkerChart;
