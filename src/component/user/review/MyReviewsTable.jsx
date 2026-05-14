import "../../../index.css";
import { formatDate } from "../../util/utilities";
import "../userDashboard.css";
import "./MyReviewsTable.css";

const MyReviewsTable = (reviews, manageReview) => {
  const reviewTableWidth = "730px";

  return (
    <div className="user-table-wrapper">
      <div className="table-header">
        <table
          className="table table-bordered table-hover table-striped"
          style={{
            tableLayout: "fixed",
            width: "100%",
            minWidth: reviewTableWidth,
            width: reviewTableWidth,
          }}
        >
          <thead>
            <tr>
              <th>주문명</th>
              <th>주문일시</th>
              <th>별점</th>
              <th>후기 시작 부분</th>
              <th>후기 작성일시</th>
              <th>주문ID</th>
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
          <tbody>
            {reviews &&
              reviews.map((review, idx) => (
                <tr key={idx}>
                  <td>{review.orderName}</td>
                  <td>{formatDate(review.orderTime)}</td>
                  <td>{review.stars}</td>
                  <td className="text-start">
                    <a href="#" onClick={() => manageReview(review)}>
                      {review.reviewPreview}
                    </a>
                  </td>
                  <td>{formatDate(review.reviewTime)}</td>
                  <td className="text-center">{review.id}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyReviewsTable;
