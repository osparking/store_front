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
import useColorMapping from "../hook/ColorMapping";

const SalesChart = ({ chartRefs, setSoldCount }) => {
  const [salesChartData, setSalesChartData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const getSalesChartData = async () => {
      try {
        const response = await callWithToken("get", "/admin/soap_sale_chart");
        const responseData = await response.data.data;

        if (responseData) {
          const total = responseData.reduce((sum, item) => {
            return sum + item["보통비누"] + item["백설공주"] + item["메주비누"];
          }, 0);
          setSoldCount(total);
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

  const colors = useColorMapping();
  const normal = "보통비누";
  const snowWt = "백설공주";
  const maeju = "메주비누";

  return (
    <section
      className="mb-2"
      ref={(el) => (chartRefs.current.sales = el)}
      style={{ scrollMarginTop: "10px" }}
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
            <Bar dataKey={normal} fill={colors[normal]} />
            <Bar dataKey={snowWt} fill={colors[snowWt]} />
            <Bar dataKey={maeju} fill={colors[maeju]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <NoDataExists dataType={"판매"} errorMessage={errorMsg} />
      )}
    </section>
  );
};

export default SalesChart;
