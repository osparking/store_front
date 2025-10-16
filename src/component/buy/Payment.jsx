import { Col, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const { paymentData } = location.state || false;

  console.log("결제 요약 정보: ", JSON.stringify(paymentData));
  const recepient = paymentData.recipRegiReq;
  const addrBasis = paymentData.recipRegiReq.addrBasisAddReq;

  return (
  <Row className="d-flex justify-content-center">
    <Col md={8}>
      {paymentData && (
        <div
          md={8}
          className="d-flex justify-items-center ms-5 me-5"
          style={{ backgroundColor: "ivory" }}
        >
          <ul>
            <li>배송처</li>
            <ul>
              <li>우편번호: {addrBasis.zipcode}</li>
              <li>기초주소: {addrBasis.roadAddress}</li>
              <li>상세주소: {recepient.addressDetail}</li>
            </ul>
            <li>결제 종합</li>
            <ul>
              <li>
                상품 가격: {paymentData.productTotal.toLocaleString()} 원
              </li>
              <li>배송비: {paymentData.deliveryFee.toLocaleString()} 원</li>
              <li>결제 금액: {paymentData.paymentFee.toLocaleString()} 원</li>
            </ul>
            <li>지정 배송사: GS 포스트박스 편의점택배 협력사 CJ대한통운(오네)</li>
            <li>결제 수단</li>
          </ul>
        </div>
      )}
    </Col>
  </Row>
);
};

export default Payment;
