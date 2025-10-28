import { Col, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const OrderDigest = () => {
  const location = useLocation();
  const { paymentData } = location.state || false;

  console.log("결제 요약 정보: ", JSON.stringify(paymentData));
  const recepient = paymentData.recipRegiReq;

  return (
    <Row className="d-flex justify-content-center">
      <Col md={8}>
        {paymentData && (
          <div
            md={8}
            className=" ms-5 me-5"
            style={{ backgroundColor: "ivory" }}
          >
            <h5>주문 요약</h5>
            <ul>
              <li>주문 이름 : {paymentData.orderName}</li>
              <li>결제 금액 : {paymentData.paymentFee.toLocaleString()} 원</li>
              <li>상세 주소 : {recepient.addressDetail}</li>
            </ul>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default OrderDigest;
