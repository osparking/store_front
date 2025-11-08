import { Col, Row } from "react-bootstrap";
import "./OrderDigest.css";

const OrderDigest = ({ name, amount, address, goRecipient }) => {
  const toRecipient = () => {
    goRecipient();
  };

  return (
    <Row className="d-flex justify-content-center">
      <Col md={6}>
        {name && (
          <div
            md={8}
            className=" ms-5 me-5"
            style={{ backgroundColor: "ivory" }}
          >
            <h5>주문 요약</h5>
            <ul>
              <li>주문 이름 : {name}</li>
              <li className="mt_0">결제 금액 : {amount.toLocaleString()} 원</li>
              <li className="mt_0">상세 주소 : {address}</li>
            </ul>
          </div>
        )}
        <button
          className="button"
          style={{
            backgroundColor: "green",
            borderColor: "green",
            marginTop: 0,
          }}
          onClick={toRecipient} // Use the extracted function
        >
          뒤로
        </button>
      </Col>
    </Row>
  );
};

export default OrderDigest;
