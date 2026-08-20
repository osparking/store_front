import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getFeeEtc } from "../buy/orderService";
import "./ManagePriceFee.css";
import DeliveryFeeCard from "./price_fee/DeliveryFeeCard";
import OtherFeeCard from "./price_fee/OtherFeeCard";
import SoapPriceCard from "./price_fee/SoapPriceCard";

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

const ManagePriceFee = () => {
  const width = useWindowWidth();
  const [feeOther, setFeeOther] = useState({});
  const [feeRegion, setFeeRegion] = useState({});

  useEffect(() => {
    console.log("배송비 기타 비용 읽기");
    const readFeeEtc = async () => {
      try {
        const response = await getFeeEtc();
        const feeRegion = [response.data.fee_03, response.data.fee_12];

        console.log("feeRegion1:", feeRegion);

        setFeeOther(response.data.feeOther);
        setFeeRegion(feeRegion);
      } catch (e) {
        console.error("배송비 기타 오류: ", e.message);
      }
    };
    readFeeEtc();
  }, []);

  return (
    <div id="priceFeeCard">
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexDirection: width < 1500 ? "column" : "row",
        }}
      >
        <div style={{ flex: 3 }}>
          <SoapPriceCard />
        </div>
        <div style={{ flex: 4 }}>
          <DeliveryFeeCard feeRegion={feeRegion} />
        </div>
        <div style={{ flex: 3 }}>
          <OtherFeeCard feeOther={feeOther} />
        </div>
      </div>
    </div>
  );
};

export default ManagePriceFee;
