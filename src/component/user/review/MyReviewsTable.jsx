import "../../../index.css";
import { formatDate } from "../../util/utilities";
import "../userDashboard.css";
import "./MyReviewsTable.css";

const MyReviewsTable = (reviews, manageReview) => {
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
                    <a href="#" onClick={() => manageReview(review)}>
                      {review.reviewPreview}
                    </a>
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
