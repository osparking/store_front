import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const { paymentData } = location.state || false;

  console.log("결제 요약 정보: ", JSON.stringify(paymentData));

  return (
    <div>
      <ul>
        <li>배송처</li>
        <li>결제 금액</li>
        <li>배송사: GS 포스트박스 편의점택배</li>
        <li>결제 수단</li>
      </ul>
    </div>
  );
};

export default Payment;
