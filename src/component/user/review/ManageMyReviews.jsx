import { useState } from "react";
import "../../../App.css";
import OrderDetail from "../../worker/order/OrderDetail";
import MyReviewsPage from "./MyReviewsPage";

const ManageMyReviews = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  return (
    <>
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
    </>
  );
};

export default ManageMyReviews;
