import { useState } from "react";
import "../../App.css";
import OrderTable from "./order/OrderTable";
import OrderDetail from "./order/OrderDetail";

const ManageOrder = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  return (
    <main>
      <h5 className="chart-title">주문 관리</h5>
      {showDetail ? (
        <OrderDetail detailId = {detailId} setShowDetail={setShowDetail} />
      ) : (
        <OrderTable setShowDetail={setShowDetail} setDetailId={setDetailId} />
      )}
    </main>
  );
};

export default ManageOrder;
