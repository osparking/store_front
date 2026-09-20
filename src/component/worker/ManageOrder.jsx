import { useState } from "react";
import "../../App.css";
import { DashboardProvider } from "../user/dashboard/DashboardContext";
import OrderDetailRead from "./order/OrderDetailRead";
import OrderTable from "./order/OrderTable";

const ManageOrder = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  return (
    <>
      {showDetail ? (
        <DashboardProvider>
          <OrderDetailRead detailId={detailId} setShowDetail={setShowDetail} />
        </DashboardProvider>
      ) : (
        <OrderTable setShowDetail={setShowDetail} setDetailId={setDetailId} />
      )}
    </>
  );
};

export default ManageOrder;
