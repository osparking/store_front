import { useState } from "react";
import "../../App.css";
import OrderTable from "./order/OrderTable";

const ManageOrder = () => {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <main>
      <h5 className="chart-title">주문 관리</h5>
      {!showDetail && <OrderTable />}
    </main>
  );
};

export default ManageOrder;
