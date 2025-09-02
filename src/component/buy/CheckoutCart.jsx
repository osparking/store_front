import { Col, Row, Table } from "react-bootstrap";
import "./checkoutCart.css";

const CheckoutCart = ({ productList, grandTotal }) => {

  return (
    <Row className="justify-content-center pt-4 rowStyle">
      <Col md={3} className="d-flex align-items-center listLeftLabel border-0">
        <div className="container">
          <p className="rightColumnParagraph">주문 상품 요약 ➡</p>
        </div>
      </Col>
      <Col md={5} style={{paddingRight: 0}}>
        <Table bordered hover striped>
          <thead>
            <tr>
              <th>외형명</th>
              <th>수량</th>
              <th>소계</th>
            </tr>
          </thead>
          <tbody>
            {productList &&
              productList.map((item, index) => (
                <tr key={index}>
                  <td>{item.shapeLabel}</td>
                  <td>{item.count}</td>
                  <td className="cartItem">
                    {item.subTotal.toLocaleString()} 원
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="grandTotal">합계 : {grandTotal} 원</td>
              </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default CheckoutCart;