import { useState } from "react";
import "../../../index.css";
import { fetchReview, patchOrderReview } from "../../buy/orderService";
import ReviewModal from "../../review/ReviewModal";
import { formatDate } from "../../util/utilities";
import "../userDashboard.css";
import "./MyReviewsTable.css";

const MyReviewsTable = (reviews) => {
  const reviewTableWidth = "820px";

  const reviewTableColumnGroup = () => {
    return (
      <colgroup>
        <col style={{ width: "07%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "20%" }} />
        <col style={{ width: "06%" }} />
        <col style={{ width: "22%" }} />
        <col style={{ width: "20%" }} />
      </colgroup>
    );
  };

  const [showReviewModal, setShowReviewModal] = useState(false);

  const closeMyReviewModal = (reloadReviews) => {
    reloadReviews && loadReviewPage();
    setShowReviewModal(false);
  };

  const [review, setReview] = useState({});

  const manageReview = async (review) => {
    const reviewInfo = await fetchReview(review.id);
    setReview({ ...review, review: reviewInfo.review });
    setShowReviewModal(true);
  };

  const saveReview = async (reviewData) => {
    setShowReviewModal(false);
    const response = await patchOrderReview(reviewData);
    return response;
  };

  return (
    <div className="user-table-wrapper">
      <div className="table-header">
        <ReviewModal
          show={showReviewModal}
          handleClose={() => setShowReviewModal(false)}
          title={"후기 관리"}
          review={review}
          saveReview={saveReview}
          editable={true}
        />
        <table
          className="table table-bordered table-hover table-striped"
          style={{
            tableLayout: "fixed",
            minWidth: reviewTableWidth,
            width: reviewTableWidth,
          }}
        >
          {reviewTableColumnGroup()}
          <thead>
            <tr>
              <th>주문ID</th>
              <th>주문명</th>
              <th>주문일시</th>
              <th>별점</th>
              <th>후기 시작 부분</th>
              <th>후기 작성일시</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="table-body my-review">
        <table
          className="table table-bordered table-hover table-striped"
          style={{
            tableLayout: "fixed",
            minWidth: reviewTableWidth,
            width: reviewTableWidth,
          }}
        >
          {reviewTableColumnGroup()}
          <tbody>
            {reviews &&
              reviews.map((review, idx) => (
                <tr key={idx}>
                  <td className="text-center">{review.id}</td>
                  <td>{review.orderName}</td>
                  <td>{formatDate(review.orderTime)}</td>
                  <td>{review.stars}</td>
                  <td className="text-start">
                    <button
                      className="spanLink"
                      onClick={() => manageReview(review)}
                    >
                      {review.reviewPreview}
                    </button>
                  </td>
                  <td>{formatDate(review.reviewTime)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyReviewsTable;
