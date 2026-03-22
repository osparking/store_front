import { useEffect, useState } from "react";
import NoDataExists from "../common/NoDataExists";
import { callWithToken } from "../util/api";
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

const SalesChart = ({chartRefs}) => {
  const [salesChartData, setSalesChartData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const getSalesChartData = async () => {
      try {
        const response = await callWithToken("get", "/admin/soap_sale_chart");
        const responseData = await response.data.data;
        if (responseData) {
          console.log("responseData:", responseData);
          setSalesChartData(responseData);
        } else {
          navigate("/login");
        }
      } catch (err) {
        setErrorMsg("판매 통계 자료 오류: ", err.message);
      }
    };
    getSalesChartData();
  }, []);

  return (
    <section
      className="mb-5"
      ref={(el) => (chartRefs.current.sales = el)}
      style={{ scrollMarginTop: "260px" }}
    >
      <h5 className="chart-title mb-3">비누 판매 집계</h5>
      {salesChartData && salesChartData.length > 0 ? (
        <ResponsiveContainer id="adminSalesChart" width={"100%"} height={300}>
          <BarChart className="p-1 makeBackLookBig" data={salesChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" angle={-50} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={"보통비누"} fill="#8884d8" />
            <Bar dataKey={"백설공주"} fill="#84d8a4" />
            <Bar dataKey={"메주비누"} fill="#a89256" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <NoDataExists dataType={"판매"} errorMessage={errorMsg} />
      )}
    </section>
  );
};

export default SalesChart;
