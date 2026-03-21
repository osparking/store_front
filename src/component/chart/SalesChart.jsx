import { useEffect, useState } from "react";
import NoDataExists from "../common/NoDataExists";
import { callWithToken } from "../util/api";
import { ResponsiveContainer } from "recharts";

const SalesChart = () => {
  const [salesChartData, setSalesChartData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const getSalesChartData = async () => {
      try {
        const response = await callWithToken(
          "get",
          "/admin/soap_sale_chart",
        );
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
    <section className="mb-5">
      <h5 className="chart-title mb-3">비누 판매 집계</h5>
      {salesChartData && salesChartData.length > 0 ? (
        <>
          <ResponsiveContainer
            width={"100%"}
            height={300}
          ></ResponsiveContainer>
        </>
      ) : (
        <NoDataExists dataType={"판매"} errorMessage={errorMsg} />
      )}
    </section>
  );
};

export default SalesChart;
