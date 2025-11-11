import { useState } from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const MyOrdersPage = () => {
  const location = useLocation();
  const [myOrders, setMyOrders] = useState(location.state?.data);
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="box_section payment_table_div">
      <div className="d-flex justify-content-center align-items-center">
        <h3>나의 주문 목록</h3>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <p>
          {myOrders && (
            <span>주문건수: {myOrders.data.pageContent.content.length}</span>
          )}
        </p>
      </div>
      {/* <div className="d-flex justify-content-between">
        <div style={{ width: "100px", visibility: "hidden" }}>
          <PaymentCountSelect />
        </div>
      </div> */}
      <div
        id="response"
        style={{ whiteSpace: "initial" }}
        className="d-flex justify-content-center align-items-center"
      >
        {myOrders && <pre>{JSON.stringify(myOrders.data.pageContent.content[1], null, 4)}</pre>}
        {/* <Table striped bordered hover>
          <thead>
            <tr>
              <th>주문ID</th>
              <th>결제일시</th>
              <th>결제방법</th>
              <th>결제금액</th>
              <th>주문명</th>
              <th>영수증</th>
            </tr>
          </thead>
          <tbody>
            {myOrders &&
              myOrders.map((payment, idx) => (
                <tr key={idx}>
                  <td>{payment.orderId}</td>
                  <td>{formatDate(payment.approvedAt)}</td>
                  <td className="text-center">{payment.method}</td>
                  <td>{Number(payment.totalAmount).toLocaleString()}원</td>
                  <td>{payment.orderName}</td>
                  <td className="text-center">
                    <a href={payment.receiptUrl} target="_blank">
                      링크
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table> */}
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <Button
          variant="info"
          onClick={() => goHome()}
          style={{ marginTop: "30px" }}
        >
          범이비누
        </Button>
      </div>
    </div>
  );
};

export default MyOrdersPage;
