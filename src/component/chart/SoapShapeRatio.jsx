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
        setShapeCount(accountData);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    getSoapShapeStat();
  }, []);

  const colors = useColorMapping();

  return (
    <section>
      {shapeCount && shapeCount.length > 0 ? (
        <React.Fragment>
          <h5
            className="chart-title mb-1 p-3"
            style={{ backgroundColor: "hsl(83, 26%, 50%)", color: "ivory" }}
          >
            비누 외형 비중
          </h5>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart className="p-3" style={{ backgroundColor: "#d8aab8ff" }}>
              <Pie
                data={shapeCount}
                dataKey="count"
                nameKey="shapeLabel"
                label
                outerRadius={75}
                fill="#8884d8"
              >
                {shapeCount.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[entry.shapeLabel]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" />
            </PieChart>
          </ResponsiveContainer>
        </React.Fragment>
      ) : (
        <NoDataExists
          dataType={" 계정 외형 비중 자료 "}
          errorMessage={errorMessage}
        />
      )}
    </section>
  );
};

export default SoapShapeRatio;
