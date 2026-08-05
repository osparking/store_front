import { useEffect, useState } from "react";
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
import { callWithToken } from "../util/api";
import "./ProduceChart.css";

const ProduceChart = ({ setProducedCount }) => {
  const [soapProduced, setSoapProduced] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const getSoapProduceStat = async () => {
      try {
        const url = "/admin/soap_produce_chart";
        const response = await callWithToken("get", url);
        const responseData = await response.data.data;

        if (responseData) {
          const total = responseData.reduce((sum, item) => {
            return sum + item["보통비누"] + item["백설공주"] + item["메주비누"];
          }, 0);
          setProducedCount(total);
          setSoapProduced(responseData);
        } else {
          navigate("/login");
        }
      } catch (err) {
        setErrorMsg("비누 생산 실적 채취 오류: ", err.message);
      }
    };
    getSoapProduceStat();
  }, []);

  return (
    <section className="mb-2 centerChart">
      <h5 className="chart-title mb-3">비누 생산 실적</h5>
      {soapProduced && soapProduced.length > 0 ? (
        <>
          <ResponsiveContainer width={"100%"} height={300}>
            <LineChart
              responsive
              data={soapProduced}
              margin={{
                top: 10,
                right: 10,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="var(--color-text-3)" />
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
