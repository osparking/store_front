import { useEffect, useState } from "react";
import DeliveryFeeCard from "./price_fee/DeliveryFeeCard";
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

  return (
    <div style={{ width: "100%", maxWidth: "700px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexDirection: width < 700 ? "column" : "row",
        }}
      >
        <div style={{ flex: 1 }}>
          <SoapPriceCard />
        </div>
        <div style={{ flex: 1 }}>
          <DeliveryFeeCard />
        </div>
      </div>
    </div>
  );
};

export default ManagePriceFee;
