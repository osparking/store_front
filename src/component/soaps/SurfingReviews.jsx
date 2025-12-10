import { useState } from "react";
import "../../App.css";
import OrderDetail from "../worker/order/OrderDetail";
import ReviewTable from "./ReviewTable";

const SurfingReviews = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  return (
    <main>
      <h5 className="chart-title pinkBack">고객 구매 후기</h5>
      {showDetail ? (
        <OrderDetail
          detailId={detailId}
          setShowDetail={setShowDetail}
          isHouse={true}
        />
      ) : (
        <ReviewTable setShowDetail={setShowDetail} setDetailId={setDetailId} />
      )}
    </main>
  );
};

export default SurfingReviews;
