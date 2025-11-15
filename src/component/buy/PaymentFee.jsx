import { Col, Row, Table } from "react-bootstrap";
import "./paymentFee.css";

const PaymentFee = ({ paymentFee }) => {
  return (
    <Row className="justify-content-center pt-0 rowStyle">
      <Col md={3} className="d-flex align-items-center listLeftLabel border-0">
        <div className="container">
          <p className="rightColumnParagraph bold">결제 금액</p>
        </div>
      </Col>
      <Col md={5} style={{ paddingRight: 0 }}>
        <Table
          className="mt-0"
          striped
          bordered={false}
          hover
          responsive
          borderless
        >
          <tbody>
            <tr style={{ border: 0 }}>
              <td
                colSpan={3}
                className="grandTotal bold pt-0 pb-0"
                style={{ border: 0 }}
              >
                {paymentFee.toLocaleString()} 원
              </td>
            </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default PaymentFee;
