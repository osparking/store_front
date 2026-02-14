import { Col, Row, Table } from "react-bootstrap";
import "./checkoutCart.css";

const CheckoutCart = ({ subTotal, deliveryFee }) => {
  return (
    <Row className="justify-content-center pt-2">
      <Col xs={8} md={8}>
        <Table bordered striped style={{ minWidth: "200px" }}>
          <thead>
            <tr>
              <th>항목</th>
              <th>금액</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>범이비누 {subTotal.count} 개</td>
              <td className="grandTotal">
                {subTotal.price.toLocaleString()}원
              </td>
            </tr>
            <tr>
              <td>배송비</td>
              <td className="grandTotal">{deliveryFee.toLocaleString()}원</td>
            </tr>
            <tr style={{ fontWeight: "bold" }}>
              <td>결제액</td>
              <td className="grandTotal">
                {(subTotal.price + deliveryFee).toLocaleString()}원
              </td>
            </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default CheckoutCart;
