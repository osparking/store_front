import DeliveryFeeCard from "./price_fee/DeliveryFeeCard";
import SoapPriceCard from "./price_fee/SoapPriceCard";

const ManagePriceFee = () => {
  return (
    <div style={{ width: "100%", maxWidth: "700px", margin: "0 auto" }}>
      <div>
        <SoapPriceCard />
      </div>
      <div>
        <DeliveryFeeCard />
      </div>
    </div>
  );
};

export default ManagePriceFee;
