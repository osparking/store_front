import { useState } from "react";
import NoDataExists from "../common/NoDataExists";

const SoapChart = () => {
  const [soapProduced, setSoapProduced] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  return (
    <section className="mb-2 centerChart">
      <h5 className="chart-title mb-3">비누 생산 실적</h5>
      {soapProduced && soapProduced.length > 0 ? (
        <>
          <ResponsiveContainer
            width={"100%"}
            height={300}
          ></ResponsiveContainer>
        </>
      ) : (
        <NoDataExists dataType={"생산"} errorMessage={errorMsg} />
      )}
    </section>
  );
};

export default SoapChart;
