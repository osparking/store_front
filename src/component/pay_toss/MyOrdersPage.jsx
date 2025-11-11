import { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../util/utilities";
import "./MyOrdersPage.css";

const MyOrdersPage = () => {
  const location = useLocation();
  const [myOrders, setMyOrders] = useState(location.state?.data);
  const orderArray = myOrders.data.pageContent.content;
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="box_section orders_table_div">
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
      <div
        id="response"
        style={{ whiteSpace: "initial" }}
        className="d-flex justify-content-center align-items-center"
      >
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>식별자</th>
              <th>주문명</th>
              <th>수신인</th>
              <th>결제액</th>
              <th>결제일</th>
              <th>영수증</th>
            </tr>
          </thead>
          <tbody>
            {orderArray &&
              orderArray.map((order, idx) => (
                <tr key={idx}>
                  <td>{order.orderId}</td>
                  <td>
                    <a href="#">{order.orderName}</a>
                  </td>
                  <td>{order.recipientName}</td>
                  <td>{Number(order.paymentAmount).toLocaleString()}원</td>
                  <td>{formatDate(order.paymentTime)}</td>
                  <td className="text-center">
                    <a href={order.receiptUrl} target="_blank">
                      링크
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
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
