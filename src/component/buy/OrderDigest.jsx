import { Col, Row } from "react-bootstrap";
import "./OrderDigest.css";

const OrderDigest = ({ name, amount, address }) => {
  return (
    <Row className="d-flex justify-content-center">
      <Col xs={12} md={12}>
        {name && (
          <div md={6} className="rounded">
            <h5 className="orderDigest">주문 요약</h5>
            <ul className="mb-0"
              style={{ marginLeft: "120px", fontSize: "13px" }}
            >
              <li>주문 이름 : {name}</li>
              <li className="mt_0">결제 금액 : {amount.toLocaleString()} 원</li>
              <li className="mt_0">주소 : {address}</li>
            </ul>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default OrderDigest;
