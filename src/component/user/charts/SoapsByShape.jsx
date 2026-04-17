import { useEffect, useState } from "react";
import { Legend, Pie, PieChart, Sector, Tooltip } from "recharts";
import NoDataExists from "../../common/NoDataExists";
import useColorMapping from "../../hook/ColorMapping";
import { getShapeCount } from "../../user/UserService";

const SoapsByShape = ({ totalSoaps }) => {
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
    <>
      <h5
        className="chart-title mb-1 p-1"
        style={{ backgroundColor: "hsl(83, 26%, 50%)", color: "ivory" }}
      >
        비누 외형 비중
      </h5>

      {totalSoaps === 0 ? (
        <NoDataExists dataType={""} />
      ) : (
        <PieChart
          width={"100%"}
          height={"250px"}
          className="p-3 userSoapShapeChartBackground"
        >
          <Pie
            data={shapeCount}
            dataKey="count"
            nameKey="shapeLabel"
            label={({ shapeLabel, count, percent }) =>
              `수량: ${Math.trunc(count)} (${(percent * 100).toFixed(0)}%)`
            }
            outerRadius={60}
            fill="#8884d8"
            shape={(props) => {
              const { index, ...restProps } = props;
              return <Sector {...restProps} fill={colors[props.shapeLabel]} />;
            }}
          ></Pie>
          <Tooltip
            formatter={(value, name) => [`${Math.trunc(value)}개`, name]}
          />
          <Legend
            layout="horizontal"
            formatter={(value, entry) => {
              return <span style={{ color: colors[value] }}>{value}</span>;
            }}
          />
        </PieChart>
      )}
    </>
  );
};

export default SoapsByShape;
