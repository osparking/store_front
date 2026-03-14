import { useState } from "react";
import "../../App.css";
import OrderTable from "./order/OrderTable";
import OrderDetail from "./order/OrderDetail";

const ManageOrder = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  return (
    <>
      {showDetail ? (
        <OrderDetail
          detailId={detailId}
          setShowDetail={setShowDetail}
          isHouse={true}
        />
      ) : (
        <OrderTable setShowDetail={setShowDetail} setDetailId={setDetailId} />
      )}
    </>
  );
};

export default ManageOrder;
