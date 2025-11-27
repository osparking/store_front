import { useState } from "react";
import "../../App.css";
import MyOrdersPage from "../pay_toss/MyOrdersPage";
import OrderDetail from "../worker/order/OrderDetail";

const ManageMyOrder = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  return (
    <main>
      <h5 className="chart-title">주문 관리</h5>
      {showDetail ? (
        <OrderDetail detailId={detailId} setShowDetail={setShowDetail} />
      ) : (
        <MyOrdersPage setShowDetail={setShowDetail} setDetailId={setDetailId} />
      )}
    </main>
  );
};

export default ManageMyOrder;
