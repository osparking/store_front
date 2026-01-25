import { useState } from "react";
import "../../App.css";
import MyOrdersPage from "../pay_toss/MyOrdersPage";
import OrderDetail from "../worker/order/OrderDetail";
import { Container } from "react-bootstrap";

const ManageMyOrder = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  return (
    <Container fluid className="home-container mt-3">
      <h5 className="chart-title">주문 관리</h5>
      {showDetail ? (
        <OrderDetail
          detailId={detailId}
          setShowDetail={setShowDetail}
          isHouse={false}
        />
      ) : (
        <MyOrdersPage setShowDetail={setShowDetail} setDetailId={setDetailId} />
      )}
    </Container>
  );
};

export default ManageMyOrder;
