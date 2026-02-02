import React, { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getShapeCount } from "../user/UserService";
import useColorMapping from "../hook/ColorMapping";
import NoDataExists from "../common/NoDataExists";

const SoapShapeRatio = () => {
  const [shapeCount, setShapeCount] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getSoapShapeStat = async () => {
      try {
        const userId = localStorage.getItem("LOGIN_ID");
        const result = await getShapeCount(userId);
        setShapeCount(result.data);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    getSoapShapeStat();
  }, []);

  const colors = useColorMapping();

  return (
    <section>
      {shapeCount && (
        <div className="chartDiv">
          <h5
            className="chart-title mb-1 p-1"
            style={{ backgroundColor: "hsl(83, 26%, 50%)", color: "ivory" }}
          >
            비누 외형 비중
          </h5>
          <ResponsiveContainer
            className="userChart"
            style={{ backgroundColor: "#d8aab8ff" }}
          >
            {shapeCount.length === 0 ? (
              <NoDataExists
                dataType={"비누 구매 건수"}
                errorMessage={errorMessage}
              />
            ) : (
              <PieChart
                className="p-3"
                style={{ backgroundColor: "#d8aab8ff" }}
              >
                <Pie
                  data={shapeCount}
                  dataKey="count"
                  nameKey="shapeLabel"
                  label={({ shapeLabel, count, percent }) =>
                    `${shapeLabel}: ${Math.trunc(count)} (${(
                      percent * 100
                    ).toFixed(1)}%)`
                  }
                  outerRadius={45}
                  fill="#8884d8"
                >
                  {shapeCount.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[entry.shapeLabel]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${Math.trunc(value)}개`, name]}
                />
                <Legend layout="horizontal" />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default SoapShapeRatio;
