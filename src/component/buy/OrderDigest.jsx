import { Col, Row } from "react-bootstrap";
import "./OrderDigest.css";

const OrderDigest = ({ name, amount, address, goRecipient }) => {
  const toRecipient = () => {
    goRecipient();
  };

  return (
    <Row className="d-flex justify-content-center">
      <Col xs={12} md={12}>
        {name && (
          <div
            md={6}
            className="small-font rounded"
            style={{ backgroundColor: "ivory", fontSize: "13px" }}
          >
            <h6>주문 요약</h6>
            <ul className="ms-4">
              <li>주문 이름 : {name}</li>
              <li className="mt_0">결제 금액 : {amount.toLocaleString()} 원</li>
              <li className="mt_0">주소 : {address}</li>
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
