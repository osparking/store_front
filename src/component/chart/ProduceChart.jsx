import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import NoDataExists from "../common/NoDataExists";
import "./ProduceChart.css";
// #region Sample data
const data = [
  {
    name: "'26-03",
    보통비누: 1000,
    백설공주: 4400,
    메주비누: 1400,
    amt: 2400,
  },
  {
    name: "'26-04",
    보통비누: 1000,
    백설공주: 3398,
    메주비누: 398,
    amt: 2210,
  },
  {
    name: "'26-05",
    보통비누: 2000,
    백설공주: 5800,
    메주비누: 2800,
    amt: 2290,
  },
  {
    name: "'26-06",
    보통비누: 2780,
    백설공주: 3908,
    메주비누: 1908,
    amt: 2000,
  },
  {
    name: "'26-07",
    보통비누: 1890,
    백설공주: 4800,
    메주비누: 1800,
    amt: 2181,
  },
  {
    name: "'26-08",
    보통비누: 2390,
    백설공주: 3800,
    메주비누: 1800,
    amt: 2500,
  },
];
// #endregion

const ProduceChart = () => {
  const [soapProduced, setSoapProduced] = useState([{}, {}]);
  const [errorMsg, setErrorMsg] = useState(null);

  return (
    <section className="mb-2 centerChart">
      <h5 className="chart-title mb-3">비누 생산 실적</h5>
      {soapProduced && soapProduced.length > 0 ? (
        <>
          <ResponsiveContainer width={"100%"} height={300}>
            <LineChart
              responsive
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="var(--color-text-3)" />
              <YAxis width="auto" stroke="var(--color-text-3)" />
              <Tooltip
                cursor={{
                  stroke: "var(--color-border-2)",
                }}
                contentStyle={{
                  backgroundColor: "var(--color-surface-raised)",
                  borderColor: "var(--color-border-2)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="백설공주"
                stroke="var(--color-chart-1)"
                dot={{
                  fill: "var(--color-surface-base)",
                }}
                activeDot={{ r: 8, stroke: "var(--color-surface-base)" }}
              />
              <Line
                type="monotone"
                dataKey="메주비누"
                stroke="var(--color-chart-2)"
                dot={{
                  fill: "var(--color-surface-base)",
                }}
                activeDot={{ r: 8, stroke: "var(--color-surface-base)" }}
              />
              <Line
                type="monotone"
                dataKey="보통비누"
                stroke="var(--color-chart-3)"
                dot={{
                  fill: "var(--color-surface-base)",
                }}
                activeDot={{ stroke: "var(--color-surface-base)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        <NoDataExists dataType={"생산"} errorMessage={errorMsg} />
      )}
    </section>
  );
};

export default ProduceChart;
