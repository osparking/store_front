import { useState } from "react";
import "../../../App.css";
import OrderDetail from "../../worker/order/OrderDetail";
import MyReviewsPage from "./MyReviewsPage";
import { Container } from "react-bootstrap";

const ManageMyReviews = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  return (
    <Container fluid className="home-container mt-5">
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
    </Container>
  );
};

export default ManageMyReviews;
