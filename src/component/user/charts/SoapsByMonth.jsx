import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import NoDataExists from "../../common/NoDataExists";

const SoapsByMonth = ({ totalSoaps, soapsMonth }) => {
  return (
    <>
      <h5
        className="chart-title mb-1 p-1"
        style={{
          backgroundColor: "hsl(83, 26%, 50%)",
          color: "ivory",
        }}
      >
        비누 구매 수량
      </h5>
      {totalSoaps > 0 ? (
        <BarChart
          width={328}
          height={238}
          data={soapsMonth}
          style={{ backgroundColor: "white" }}
        >
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
          <Legend
            formatter={(value, entry) => (
              <span style={{ color: "#87a15e" }}>{value}</span>
            )}
          />
        </BarChart>
      ) : (
        <NoDataExists dataType={""} />
      )}
    </>
  );
};

export default SoapsByMonth;
