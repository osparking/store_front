import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import NoDataExists from "../common/NoDataExists";

const SoapsMonthUser = ({ soapsMonth, errorMessage }) => {
  return (
    <section>
      {soapsMonth && soapsMonth.length > 0 ? (
        <React.Fragment>
          <ResponsiveContainer width={"100%"} height={250}>
            <h5
              className="chart-title mb-1 p-3"
              style={{ backgroundColor: "hsl(83, 26%, 50%)", color: "ivory" }}
            >
              비누 구매 수량{" "}
            </h5>
            <BarChart data={soapsMonth} style={{ backgroundColor: "white" }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" angle={-30} textAnchor="end" height={70} />
              <YAxis
                width={40}
                tick={{ fill: "#232a31ff", fontSize: 15 }}
                axisLine={{ stroke: "#495057" }}
              />
              <Tooltip />
              <Bar dataKey="월별 수량">
                {soapsMonth.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </React.Fragment>
      ) : (
        <NoDataExists dataType={"비누 구매 수량"} errorMessage={errorMessage} />
      )}
    </section>
  );
};

export default SoapsMonthUser;
