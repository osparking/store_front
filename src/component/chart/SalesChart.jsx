import { useState } from "react";
import NoDataExists from "../common/NoDataExists";

const SalesChart = () => {
  const [soapSold, setSoapSold] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  return (
    <section className="mb-5">
      <h5 className="chart-title mb-3">비누 판매 집계</h5>
      {soapSold && soapSold.length > 0 ? (
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
