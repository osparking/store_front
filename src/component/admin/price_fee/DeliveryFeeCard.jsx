import React, { useEffect } from "react";

const DeliveryFeeCard = () => {
  useEffect(() => {
    console.log("배송비 관련 비용을 읽음");
  }, []);
  return <div>배송비 정보</div>;
};

export default DeliveryFeeCard;
