import { useState } from "react";
import "../../../App.css";
import OrderDetail from "../../worker/order/OrderDetail";
import MyReviewsPage from "./MyReviewsPage";

const ManageMyReviews = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  return (
    <main>
      <h5 className="chart-title">후기 관리</h5>
      {showDetail ? (
        <OrderDetail
          detailId={detailId}
          setShowDetail={setShowDetail}
          isHouse={false}
        />
      ) : (
        <MyReviewsPage
          setShowDetail={setShowDetail}
          setDetailId={setDetailId}
        />
      )}
    </main>
  );
};

export default ManageMyReviews;
